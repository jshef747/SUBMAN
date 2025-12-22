import {
  IsString,
  IsNumber,
  Min,
  IsPositive,
  MinLength,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @MinLength(1)
  subscriptionServiceName: string;

  @IsNumber()
  subscriptionServiceCostPerCycle: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  subscriptionServiceCycleInDays: number;
}
