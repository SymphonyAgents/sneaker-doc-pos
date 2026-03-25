import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateCardBankDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  feePercent?: number;
}
