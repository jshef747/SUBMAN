import {
  IsNumber,
  IsString,
  Min,
  MinLength,
  IsPositive,
} from 'class-validator';

export class UpdateSubscriptionDto {
  @IsString()
  @MinLength(1)
  subscriptionServiceName?: string;

  @IsNumber()
  subscriptionServiceCostPerCycle?: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  subscriptionServiceCycleInDays?: number;
}
