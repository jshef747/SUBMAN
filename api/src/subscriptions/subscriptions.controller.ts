/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SupabaseGuard } from 'src/auth/supabase.guard';

@Controller('subscriptions')
@UseGuards(SupabaseGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Request() req) {
    Logger.log(
      'Received request to create subscription',
      'SubscriptionsController',
    );
    const userId = req.user.id;
    return this.subscriptionsService.create(createSubscriptionDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    Logger.log(
      'Received request to fetch all subscriptions',
      'SubscriptionsController',
    );
    const userId: string = req.user.id;
    return this.subscriptionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    Logger.log(
      `Received request to fetch subscription with ID ${id}`,
      'SubscriptionsController',
    );
    const userId: string = req.user.id;
    return this.subscriptionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @Request() req,
  ) {
    Logger.log(
      `Received request to update subscription with ID ${id}`,
      'SubscriptionsController',
    );
    const userId: string = req.user.id;
    return this.subscriptionsService.update(id, updateSubscriptionDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    Logger.log(
      `Received request to delete subscription with ID ${id}`,
      'SubscriptionsController',
    );
    const userId: string = req.user.id;
    return this.subscriptionsService.remove(id, userId);
  }
}
