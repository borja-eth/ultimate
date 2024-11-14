import { useForm } from 'react-hook-form';
import { TradeType } from '@/types/trade';

interface TradeFormInputs {
  type: TradeType;
  amount: number;
  price: number;
}

interface TradeFormProps {
  onSubmit: (data: TradeFormInputs) => void;
}

export default function TradeForm({ onSubmit }: TradeFormProps) {
  const { register, handleSubmit, reset, watch } = useForm<TradeFormInputs>();
  const tradeType = watch('type');

  return (
    <form onSubmit={handleSubmit((data) => {
      onSubmit(data);
      reset();
    })} className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-6">
          {/* Trade Type Selector */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg bg-gray-800 p-1">
              <div className="w-48 grid grid-cols-2">
                <label className="relative">
                  <input
                    type="radio"
                    {...register('type')}
                    value="BUY"
                    className="peer sr-only"
                  />
                  <div className={`cursor-pointer rounded-l-lg py-2 text-center text-sm font-medium transition-colors
                    ${tradeType === 'BUY' 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-400 hover:text-white'}`}>
                    Buy
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    {...register('type')}
                    value="SELL"
                    className="peer sr-only"
                  />
                  <div className={`cursor-pointer rounded-r-lg py-2 text-center text-sm font-medium transition-colors
                    ${tradeType === 'SELL' 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-white'}`}>
                    Sell
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (BTC)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-400 sm:text-sm">₿</span>
              </div>
              <input
                type="number"
                step="0.00000001"
                {...register('amount', { 
                  required: true,
                  min: 0.00000001 
                })}
                className="block w-full rounded-lg border-0 bg-gray-800 py-3 pl-8 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00000000"
              />
            </div>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (USD)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('price', { 
                  required: true,
                  min: 0.01 
                })}
                className="block w-full rounded-lg border-0 bg-gray-800 py-3 pl-8 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className={`w-full rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 
              ${tradeType === 'BUY' 
                ? 'bg-green-500 hover:bg-green-600' 
                : tradeType === 'SELL' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {tradeType === 'BUY' ? 'Place Buy Order' : tradeType === 'SELL' ? 'Place Sell Order' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
}