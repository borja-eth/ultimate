import { supabase } from '@/lib/supabase';
import { Trade, TradeType, TradeStatus } from '@/types/trade';
import toast from 'react-hot-toast';

interface DBTrade {
  id: string;
  type: TradeType;
  open_amount: number;
  open_price: number;
  open_date: string;
  remaining_amount: number;
  close_amount?: number;
  close_price?: number;
  close_date?: string;
  status: TradeStatus;
}

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
      // Log de los datos recibidos
      console.log('Received trade data:', trade);

      // Preparar los datos para Supabase
      const tradeData = {
        type: trade.type,
        open_amount: trade.openAmount,
        open_price: trade.openPrice,
        open_date: new Date().toISOString(),
        remaining_amount: trade.remainingAmount,
        status: trade.status
      };

      // Log de los datos formateados
      console.log('Formatted trade data for Supabase:', tradeData);

      // Intentar insertar en Supabase
      const { data, error } = await supabase
        .from('trades')
        .insert([tradeData])
        .select('*')
        .single();

      // Si hay error, loguearlo detalladamente
      if (error) {
        console.error('Supabase insertion error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        toast.error(`Database error: ${error.message}`);
        throw error;
      }

      // Si no hay datos, lanzar error
      if (!data) {
        console.error('No data returned from Supabase');
        toast.error('No data returned from database');
        throw new Error('No data returned from database');
      }

      // Log de los datos recibidos de Supabase
      console.log('Received data from Supabase:', data);

      // Mapear y retornar los datos
      const mappedTrade = this.mapTradeFromDB(data);
      console.log('Mapped trade:', mappedTrade);
      
      toast.success('Trade created successfully');
      return mappedTrade;
    } catch (error) {
      // Log detallado del error
      console.error('Detailed error in createTrade:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      
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

  mapTradeFromDB(dbTrade: DBTrade): Trade {
    try {
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
    } catch (error) {
      console.error('Error mapping trade from DB:', {
        error,
        dbTrade
      });
      throw error;
    }
  }
}; 