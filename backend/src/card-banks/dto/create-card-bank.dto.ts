import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateCardBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  feePercent: number;
}
