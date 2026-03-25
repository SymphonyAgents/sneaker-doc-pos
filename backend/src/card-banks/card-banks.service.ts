import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../db/drizzle.service';
import { cardBanks } from '../db/schema';
import { CreateCardBankDto } from './dto/create-card-bank.dto';
import { UpdateCardBankDto } from './dto/update-card-bank.dto';

@Injectable()
export class CardBanksService {
  constructor(private readonly drizzle: DrizzleService) {}

  findAll() {
    return this.drizzle.db
      .select()
      .from(cardBanks)
      .orderBy(cardBanks.id);
  }

  async findOne(id: number) {
    const [row] = await this.drizzle.db
      .select()
      .from(cardBanks)
      .where(eq(cardBanks.id, id));
    if (!row) throw new NotFoundException(`Card bank ${id} not found`);
    return row;
  }

  async create(dto: CreateCardBankDto) {
    const [row] = await this.drizzle.db
      .insert(cardBanks)
      .values({
        name: dto.name,
        feePercent: String(dto.feePercent),
        isDefault: false,
      })
      .returning();
    return row;
  }

  async update(id: number, dto: UpdateCardBankDto) {
    const patch: Partial<typeof cardBanks.$inferInsert> = {};
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.feePercent !== undefined) patch.feePercent = String(dto.feePercent);

    const [row] = await this.drizzle.db
      .update(cardBanks)
      .set(patch)
      .where(eq(cardBanks.id, id))
      .returning();
    if (!row) throw new NotFoundException(`Card bank ${id} not found`);
    return row;
  }

  async remove(id: number) {
    const [row] = await this.drizzle.db
      .delete(cardBanks)
      .where(eq(cardBanks.id, id))
      .returning();
    if (!row) throw new NotFoundException(`Card bank ${id} not found`);
    return { deleted: true };
  }

  /**
   * Returns the fee rate (0–1) for a given bank name.
   * Falls back to the isDefault entry if no match found.
   * Used by TransactionsService for fee calculation.
   */
  async getFeeRate(bankName: string | null | undefined): Promise<{ rate: number; feePercent: string }> {
    const all = await this.drizzle.db.select().from(cardBanks).orderBy(cardBanks.id);
    if (all.length === 0) {
      // Fallback if table is empty (shouldn't happen after seed)
      return { rate: 0.03, feePercent: '3.00' };
    }

    let match = bankName
      ? all.find((b) => b.name.toLowerCase() === bankName.toLowerCase())
      : null;

    if (!match) {
      match = all.find((b) => b.isDefault) ?? all[0];
    }

    const rate = parseFloat(match.feePercent) / 100;
    const feePercent = parseFloat(match.feePercent).toFixed(2);
    return { rate, feePercent };
  }
}
