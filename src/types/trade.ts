export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED';

export interface Trade {
  id: string;
  type: TradeType;
  openAmount: number;
  openPrice: number;
  openDate: Date;
  remainingAmount: number;
  closeAmount?: number;
  closePrice?: number;
  closeDate?: Date;
  status: TradeStatus;
}

export interface PnL {
  realizedUSD: number;
  realizedBTC: number;
  unrealizedUSD: number;
  unrealizedBTC: number;
}

export interface TradeFormData {
  type: TradeType;
  amount: number;
  price: number;
} 