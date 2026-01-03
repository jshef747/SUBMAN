import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [ScheduleModule.forRoot(), SubscriptionsModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
