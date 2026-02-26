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

const DEMO_USER_ID = 'demo-user';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    Logger.log(
      'Received request to create subscription',
      'SubscriptionsController',
    );
    return this.subscriptionsService.create(createSubscriptionDto, DEMO_USER_ID);
  }

  @Get()
  findAll() {
    Logger.log(
      'Received request to fetch all subscriptions',
      'SubscriptionsController',
    );
    return this.subscriptionsService.findAll(DEMO_USER_ID);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    Logger.log(
      `Received request to fetch subscription with ID ${id}`,
      'SubscriptionsController',
    );
    return this.subscriptionsService.findOne(id, DEMO_USER_ID);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    Logger.log(
      `Received request to update subscription with ID ${id}`,
      'SubscriptionsController',
    );
    return this.subscriptionsService.update(id, updateSubscriptionDto, DEMO_USER_ID);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    Logger.log(
      `Received request to delete subscription with ID ${id}`,
      'SubscriptionsController',
    );
    return this.subscriptionsService.remove(id, DEMO_USER_ID);
  }
}
