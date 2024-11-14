import { supabase } from '@/lib/supabase';
import { Trade } from '@/types/trade';
import toast from 'react-hot-toast';

export const tradeService = {
  async getAllTrades(): Promise<Trade[]> {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('open_date', { ascending: false });

      if (error) {
        console.error('Error fetching trades:', error);
        toast.error('Error loading trades');
        throw error;
      }

      return data.map(this.mapTradeFromDB);
    } catch (error) {
      console.error('Error in getAllTrades:', error);
      toast.error('Failed to load trades');
      throw error;
    }
  },

  async createTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([{
          type: trade.type,
          open_amount: trade.openAmount,
          open_price: trade.openPrice,
          remaining_amount: trade.remainingAmount,
          status: trade.status
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating trade:', error);
        toast.error('Error creating trade');
        throw error;
      }

      toast.success('Trade created successfully');
      return this.mapTradeFromDB(data);
    } catch (error) {
      console.error('Error in createTrade:', error);
      toast.error('Failed to create trade');
      throw error;
    }
  },

  async updateTrade(trade: Trade): Promise<Trade> {
    try {
      const { data, error } = await supabase
        .from('trades')
        .update({
          remaining_amount: trade.remainingAmount,
          close_amount: trade.closeAmount,
          close_price: trade.closePrice,
          close_date: trade.closeDate,
          status: trade.status
        })
        .eq('id', trade.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating trade:', error);
        toast.error('Error updating trade');
        throw error;
      }

      toast.success('Trade updated successfully');
      return this.mapTradeFromDB(data);
    } catch (error) {
      console.error('Error in updateTrade:', error);
      toast.error('Failed to update trade');
      throw error;
    }
  },

  async deleteTrade(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting trade:', error);
        toast.error('Error deleting trade');
        throw error;
      }

      toast.success('Trade deleted successfully');
    } catch (error) {
      console.error('Error in deleteTrade:', error);
      toast.error('Failed to delete trade');
      throw error;
    }
  },

  mapTradeFromDB(dbTrade: any): Trade {
    return {
      id: dbTrade.id,
      type: dbTrade.type,
      openAmount: Number(dbTrade.open_amount),
      openPrice: Number(dbTrade.open_price),
      openDate: new Date(dbTrade.open_date),
      remainingAmount: Number(dbTrade.remaining_amount),
      closeAmount: dbTrade.close_amount ? Number(dbTrade.close_amount) : undefined,
      closePrice: dbTrade.close_price ? Number(dbTrade.close_price) : undefined,
      closeDate: dbTrade.close_date ? new Date(dbTrade.close_date) : undefined,
      status: dbTrade.status
    };
  }
}; 