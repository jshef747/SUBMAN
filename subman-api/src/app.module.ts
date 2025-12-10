import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  controllers: [AppController, SubscriptionsController],
  providers: [AppService, SubscriptionsService],
})
export class AppModule {}
