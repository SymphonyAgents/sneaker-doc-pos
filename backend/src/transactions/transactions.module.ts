import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PromosModule } from '../promos/promos.module';
import { CardBanksModule } from '../card-banks/card-banks.module';

@Module({
  imports: [DbModule, AuthModule, UsersModule, PromosModule, CardBanksModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
