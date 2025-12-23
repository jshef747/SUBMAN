/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsPositive, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from "class-validator";

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  payCycle: string;

  @IsNumber()
  @IsPositive()
  pricePerCycle: number;

  @IsString()
  @IsDateString()
  renewalDate: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
