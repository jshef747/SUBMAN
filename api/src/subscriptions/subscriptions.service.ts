import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, userId: string) {
    const { renewalDate, ...rest } = createSubscriptionDto;
    Logger.log('Creating new subscription', 'SubscriptionsService');
    return this.prisma.subscription.create({
      data: {
        ...rest,
        renewalDate: new Date(renewalDate),
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    Logger.log('Fetching all subscriptions', 'SubscriptionsService');
    return this.prisma.subscription.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: string) {
    Logger.log(`Fetching subscription with ID ${id}`, 'SubscriptionsService');
    const subscription = await this.prisma.subscription.findUnique({
      where: { id, userId },
    });

    if (!subscription) {
      Logger.warn(
        `Subscription with ID ${id} not found`,
        'SubscriptionsService',
      );
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
    userId: string,
  ) {
    const { renewalDate, ...rest } = updateSubscriptionDto;
    const dataToUpdate: any = { ...rest };

    if (renewalDate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      dataToUpdate.renewalDate = new Date(renewalDate);
    }

    try {
      Logger.log(`Updating subscription with ID ${id}`, 'SubscriptionsService');
      return await this.prisma.subscription.update({
        where: { id, userId },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: dataToUpdate,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2025') {
        Logger.warn(
          `Subscription with ID ${id} not found`,
          'SubscriptionsService',
        );
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number, userId: string) {
    try {
      Logger.log(`Deleting subscription with ID ${id}`, 'SubscriptionsService');
      return await this.prisma.subscription.delete({
        where: { id, userId },
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2025') {
        Logger.warn(
          `Subscription with ID ${id} not found`,
          'SubscriptionsService',
        );
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }
      throw error;
    }
  }
}
