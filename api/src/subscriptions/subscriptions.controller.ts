import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    Logger.log('Received request to create subscription', 'SubscriptionsController');
    const userId = 'professor-test-user';
    return this.subscriptionsService.create(createSubscriptionDto, userId);
  }

  @Get()
  findAll() {
    Logger.log('Received request to fetch all subscriptions', 'SubscriptionsController');
    const userId = 'professor-test-user';
    return this.subscriptionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    Logger.log(`Received request to fetch subscription with ID ${id}`, 'SubscriptionsController');
    const userId = 'professor-test-user';
    return this.subscriptionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    Logger.log(`Received request to update subscription with ID ${id}`, 'SubscriptionsController');
    const userId = 'professor-test-user';
    return this.subscriptionsService.update(id, updateSubscriptionDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    Logger.log(`Received request to delete subscription with ID ${id}`, 'SubscriptionsController');
    const userId = 'professor-test-user';
    return this.subscriptionsService.remove(id, userId);
  }
}
