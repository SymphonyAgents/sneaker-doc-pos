import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class ReconcileTransactionDto {
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/)
  reconciledAmount: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
