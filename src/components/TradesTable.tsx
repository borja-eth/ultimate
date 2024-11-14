import { Trade, PnL } from '@/types/trade';

interface TradesTableProps {
  trades: Trade[];
  currentPrice: number;
  onCloseTrade: (tradeId: string) => void;
  onDeleteTrade: (tradeId: string) => void;
  onEditTrade: (trade: Trade) => void;
}

export default function TradesTable({ 
  trades, 
  currentPrice, 
  onCloseTrade, 
  onDeleteTrade, 
  onEditTrade 
}: TradesTableProps) {
  const calculatePnL = (trade: Trade): PnL => {
    const pnl: PnL = {
      realizedUSD: 0,
      realizedBTC: 0,
      unrealizedUSD: 0,
      unrealizedBTC: 0
    };

    if (trade.status === 'OPEN') {
      if (trade.type === 'BUY') {
        // Para compras spot, solo calculamos P&L en USD
        pnl.unrealizedUSD = (currentPrice - trade.openPrice) * trade.remainingAmount;
      } else {
        // Para ventas, solo calculamos P&L en BTC
        const btcValueAtOpen = trade.openPrice * trade.remainingAmount;
        const btcValueAtCurrent = currentPrice * trade.remainingAmount;
        pnl.unrealizedBTC = (btcValueAtOpen - btcValueAtCurrent) / currentPrice;
      }
    } else if (trade.closePrice && trade.closeAmount) {
      if (trade.type === 'BUY') {
        // Para compras cerradas, solo P&L en USD
        pnl.realizedUSD = (trade.closePrice - trade.openPrice) * trade.closeAmount;
      } else {
        // Para ventas cerradas, solo P&L en BTC
        const btcValueAtOpen = trade.openPrice * trade.closeAmount;
        const btcValueAtClose = trade.closePrice * trade.closeAmount;
        pnl.realizedBTC = (btcValueAtOpen - btcValueAtClose) / trade.closePrice;
      }
    }

    return pnl;
  };

  const formatBTC = (amount: number): string => {
    return Number(amount).toFixed(8);
  };

  const formatUSD = (amount: number): string => {
    return Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount (BTC)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price (USD)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">P&L</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {trades.map((trade) => {
            const pnl = calculatePnL(trade);
            return (
              <tr key={trade.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(trade.openDate).toLocaleDateString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatBTC(trade.remainingAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${formatUSD(trade.openPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    trade.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {trade.type === 'BUY' ? (
                    <span className={`${
                      trade.status === 'OPEN' 
                        ? (pnl.unrealizedUSD >= 0 ? 'text-green-400' : 'text-red-400')
                        : (pnl.realizedUSD >= 0 ? 'text-green-400' : 'text-red-400')
                    }`}>
                      {trade.status === 'OPEN'
                        ? `$${formatUSD(pnl.unrealizedUSD)} (Unrealized)`
                        : `$${formatUSD(pnl.realizedUSD)} (Realized)`
                      }
                    </span>
                  ) : (
                    <span className={`${
                      trade.status === 'OPEN'
                        ? (pnl.unrealizedBTC >= 0 ? 'text-green-400' : 'text-red-400')
                        : (pnl.realizedBTC >= 0 ? 'text-green-400' : 'text-red-400')
                    }`}>
                      {trade.status === 'OPEN'
                        ? `₿${formatBTC(pnl.unrealizedBTC)} (Unrealized)`
                        : `₿${formatBTC(pnl.realizedBTC)} (Realized)`
                      }
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEditTrade(trade)}
                    className="text-blue-400 hover:text-blue-300 mr-2"
                  >
                    Edit
                  </button>
                  {trade.status === 'OPEN' && (
                    <button
                      onClick={() => onCloseTrade(trade.id)}
                      className="text-green-400 hover:text-green-300 mr-2"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTrade(trade.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 