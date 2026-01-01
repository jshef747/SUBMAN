import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import * as nodemailer from 'nodemailer';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class NotificationsService implements OnModuleInit {
    private readonly logger = new Logger(NotificationsService.name);
    private transporter: nodemailer.Transporter;
    private supabaseAdmin: SupabaseClient;

    constructor(private readonly prisma: PrismaService) { }

    onModuleInit() {
        this.setupTransporter();
        this.setupSupabase();
    }

    private setupTransporter() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    private setupSupabase() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            this.logger.warn(
                'Supabase URL or Service Role Key is missing. User emails cannot be fetched.',
            );
            return;
        }

        this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async handleCron() {
        this.logger.log('Running daily subscription due date check...');

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        try {
            // Find subscriptions renewing tomorrow
            const subscriptions = await this.prisma.subscription.findMany({
                where: {
                    renewalDate: {
                        gte: tomorrow,
                        lt: dayAfterTomorrow,
                    },
                    isActive: true,
                },
            });

            if (subscriptions.length === 0) {
                this.logger.log('No subscriptions due tomorrow.');
                return;
            }

            // Group by user to send one email per user? Or one per subscription?
            // Let's do one per subscription for now as it's simpler, or better: group by user.
            const subscriptionsByUser = new Map<string, typeof subscriptions>();

            for (const sub of subscriptions) {
                if (!subscriptionsByUser.has(sub.userId)) {
                    subscriptionsByUser.set(sub.userId, []);
                }
                subscriptionsByUser.get(sub.userId)?.push(sub);
            }

            for (const [userId, subs] of subscriptionsByUser) {
                await this.notifyUser(userId, subs);
            }
        } catch (error) {
            this.logger.error('Error handling subscription notifications', error);
        }
    }

    private async notifyUser(userId: string, subscriptions: any[]) {
        if (!this.supabaseAdmin) {
            this.logger.error('Supabase Admin client not initialized.');
            return;
        }

        // specific to supabase auth schema
        const { data: { user }, error } = await this.supabaseAdmin.auth.admin.getUserById(userId);

        if (error || !user || !user.email) {
            this.logger.error(`Could not fetch user ${userId} email: ${error?.message}`);
            return;
        }

        const emailBody = `
      <h1>Upcoming Subscription Renewals</h1>
      <p>The following subscriptions are due for renewal tomorrow:</p>
      <ul>
        ${subscriptions
                .map(
                    (sub) =>
                        `<li><strong>${sub.name}</strong>: ${sub.pricePerCycle} ${sub.currency}</li>`,
                )
                .join('')}
      </ul>
      <p>Check your dashboard for more details.</p>
    `;

        await this.sendEmail(user.email, 'Upcoming Subscription Renewal', emailBody);
    }

    private async sendEmail(to: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Subman" <noreply@subman.com>',
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
        }
    }
}
