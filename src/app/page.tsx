'use client';
import { useState, useEffect } from 'react';
import TradeForm from '@/components/TradeForm';
import TradesTable from '@/components/TradesTable';
import Sidebar from '@/components/Sidebar';
import { Trade, PnL, TradeType } from '@/types/trade';
import { getCurrentBitcoinPrice } from '@/services/bitcoin';
import CloseTradeModal from '@/components/CloseTradeModal';
import EditTradeModal from '@/components/EditTradeModal';

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [totalPnL, setTotalPnL] = useState({ usd: 0, btc: 0 });

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getCurrentBitcoinPrice();
      setCurrentPrice(price);
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateTotalPnL = () => {
      let totalUSD = 0;
      let totalBTC = 0;

      trades.forEach(trade => {
        if (trade.status === 'OPEN') {
          if (trade.type === 'BUY') {
            totalUSD += (currentPrice - trade.openPrice) * trade.remainingAmount;
          } else {
            const btcValueAtOpen = trade.openPrice * trade.remainingAmount;
            const btcValueAtCurrent = currentPrice * trade.remainingAmount;
            totalBTC += (btcValueAtOpen - btcValueAtCurrent) / currentPrice;
          }
        }

        if (trade.closePrice && trade.closeAmount) {
          if (trade.type === 'BUY') {
            totalUSD += (trade.closePrice - trade.openPrice) * trade.closeAmount;
          } else {
            const btcValueAtOpen = trade.openPrice * trade.closeAmount;
            const btcValueAtClose = trade.closePrice * trade.closeAmount;
            totalBTC += (btcValueAtOpen - btcValueAtClose) / trade.closePrice;
          }
        }
      });

      setTotalPnL({ usd: totalUSD, btc: totalBTC });
    };

    calculateTotalPnL();
  }, [trades, currentPrice]);

  const handleNewTrade = (data: any) => {
    const newTrade: Trade = {
      id: Date.now().toString(),
      type: data.type,
      openAmount: Number(data.amount),
      openPrice: Number(data.price),
      openDate: new Date(),
      remainingAmount: Number(data.amount),
      status: 'OPEN'
    };

    setTrades([...trades, newTrade]);
  };

  const handleCloseTrade = (tradeId: string) => {
    const trade = trades.find(t => t.id === tradeId);
    if (trade) {
      setSelectedTrade(trade);
      setIsCloseModalOpen(true);
    }
  };

  const handleDeleteTrade = (tradeId: string) => {
    setTrades(trades.filter(trade => trade.id !== tradeId));
  };

  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditModalOpen(true);
  };

  const handleCloseTradeSubmit = (tradeId: string, closeAmount: number, closePrice: number) => {
    setTrades(trades.map(trade => {
      if (trade.id === tradeId) {
        const newRemainingAmount = trade.remainingAmount - closeAmount;
        return {
          ...trade,
          remainingAmount: newRemainingAmount,
          closeAmount: closeAmount,
          closePrice: closePrice,
          closeDate: new Date(),
          status: newRemainingAmount <= 0 ? 'CLOSED' : 'OPEN'
        };
      }
      return trade;
    }));
  };

  const handleEditTradeSubmit = (tradeId: string, openAmount: number, openPrice: number) => {
    setTrades(trades.map(trade => {
      if (trade.id === tradeId) {
        return {
          ...trade,
          openAmount,
          openPrice,
          remainingAmount: openAmount
        };
      }
      return trade;
    }));
  };

  return (
    <div className="h-full">
      <Sidebar />
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8">
          <div className="mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Current Price Card */}
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="rounded-md bg-green-500 p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            BTC Price
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              ${currentPrice.toLocaleString()}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total P&L USD Card */}
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`rounded-md ${totalPnL.usd >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3`}>
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Total P&L (USD)
                          </dt>
                          <dd className="flex items-baseline">
                            <div className={`text-2xl font-semibold ${totalPnL.usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ${totalPnL.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total P&L BTC Card */}
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`rounded-md ${totalPnL.btc >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3`}>
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v-2m0 2v2m0 8v-2m0 2v-2m0-6h.01M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Total P&L (BTC)
                          </dt>
                          <dd className="flex items-baseline">
                            <div className={`text-2xl font-semibold ${totalPnL.btc >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ₿{totalPnL.btc.toFixed(8)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-gray-800 shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      New Trade
                    </h3>
                    <div className="mt-5">
                      <TradeForm onSubmit={handleNewTrade} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-gray-800 shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-white mb-4">
                      Active Trades
                    </h3>
                    <TradesTable
                      trades={trades}
                      currentPrice={currentPrice}
                      onCloseTrade={handleCloseTrade}
                      onDeleteTrade={handleDeleteTrade}
                      onEditTrade={handleEditTrade}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <CloseTradeModal
        isOpen={isCloseModalOpen}
        trade={selectedTrade}
        currentPrice={currentPrice}
        onClose={() => {
          setIsCloseModalOpen(false);
          setSelectedTrade(null);
        }}
        onSubmit={handleCloseTradeSubmit}
      />

      <EditTradeModal
        isOpen={isEditModalOpen}
        trade={selectedTrade}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTrade(null);
        }}
        onSubmit={handleEditTradeSubmit}
      />
    </div>
  );
}
