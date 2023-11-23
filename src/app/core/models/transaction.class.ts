import { GameType } from 'src/app/core/models/pool/game-type.type';

export class Transaction {
  public readonly amount: number | null;
  public readonly amountString: string;
  public readonly amountType: AmountType;
  public readonly description: string | null;
  public readonly id: string;
  public readonly pool: string | null;
  public readonly poolType: GameType | null;
  public readonly seat: string | null;
  public readonly status: string;
  public readonly table: string | null;
  public readonly timestamp: Date | null;
  public readonly type: string;

  constructor(private middlewareTransaction: MiddlewareTransaction) {
    this.amount = middlewareTransaction.Amount || null;
    this.amountType = this.getAmountType(middlewareTransaction.AmountType);
    this.id = middlewareTransaction.transactionID || 'unknown';
    this.status = middlewareTransaction.Status || 'unknown';
    this.timestamp = middlewareTransaction.TransactionDT
      ? new Date(middlewareTransaction.TransactionDT)
      : null;
    this.type =
      middlewareTransaction.TransactionType?.toLocaleLowerCase() || 'unknown';
    this.amountString = this.getAmountString(
      this.amount,
      this.amountType,
      this.type,
    );
    if (middlewareTransaction.Description) {
      this.description = this.getDescription(middlewareTransaction.Description);
      this.pool = this.getPool(middlewareTransaction.Description);
      this.poolType = this.getPoolType(middlewareTransaction.Description);
      this.seat = this.getSeat(middlewareTransaction.Description);
      this.table = this.getTable(middlewareTransaction.Description);
    } else {
      this.description = null;
      this.pool = null;
      this.poolType = null;
      this.seat = null;
      this.table = null;
    }
  }

  private getAmountString(
    amount: number | null,
    amountType: AmountType,
    type: string,
  ): string {
    let amountString = '';
    if (type === 'withdraw') {
      amountString += '-';
    } else if (type !== 'void' && type !== 'win') {
      return '';
    }

    if (amount === null || amountType === null) {
      return '';
    } else if (amountType === 'points') {
      amountString += `${amount} points`;
    } else {
      amountString += `£${amount.toFixed(2)}`;
    }

    return amountString;
  }

  private getDescription(description: string): string {
    const searchIndex = description.indexOf(':');
    return description.slice(0, searchIndex).trim();
  }

  private getPool(description: string): string {
    const searchIndex = description.indexOf(':');
    description = description.slice(searchIndex + 1).trim();
    let split = description.split('table');
    split = split[0].split('(');
    split = split[0].split('  ');
    return split[0].trim() || '';
  }

  private getPoolType(description: string): GameType | null {
    description = description.toLocaleLowerCase();
    if (description.includes('classic pool')) {
      return 'predictor';
    }
    if (description.includes('fantasy')) {
      return 'survivor';
    }
    if (description.includes('last man') || description.includes('survivor')) {
      return 'survivor';
    }
    return null;
  }

  private getTable(description: string): string {
    return this.getSeatOrTableId(description, 'table');
  }

  private getSeat(description: string): string {
    return this.getSeatOrTableId(description, 'seat');
  }

  private getSeatOrTableId(
    description: string,
    search: 'seat' | 'table',
  ): string {
    description = description.toLocaleLowerCase();
    const tableIndex = description.indexOf(search);
    if (tableIndex === -1) return '';
    const tableString = description.slice(tableIndex);
    const split = tableString.split(' ');
    if (/^\d+$/g.test(split[1])) {
      return split[1];
    }
    return '';
  }

  private getAmountType(amountType: string | undefined): AmountType {
    if (amountType === 'cash') {
      return 'cash';
    } else if (amountType === 'points') {
      return 'points';
    } else {
      return null;
    }
  }
}

type AmountType = 'cash' | 'points' | null;

export type MiddlewareTransaction = Partial<{
  Source: string;
  TransactionType: string;
  Status: string;
  Amount: number;
  Description: string;
  AmountType: string;
  transactionID: string;
  TransactionDT: string;
  OppResponseCode: unknown;
  OppMessage: unknown;
}>;
