import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Trade } from '@/types/trade';

interface CloseTradeModalProps {
  isOpen: boolean;
  trade: Trade | null;
  currentPrice: number;
  onClose: () => void;
  onSubmit: (tradeId: string, closeAmount: number, closePrice: number) => void;
}

interface CloseTradeInputs {
  closeAmount: number;
  closePrice: number;
}

export default function CloseTradeModal({ isOpen, trade, currentPrice, onClose, onSubmit }: CloseTradeModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CloseTradeInputs>({
    defaultValues: {
      closeAmount: trade?.remainingAmount,
      closePrice: currentPrice
    }
  });

  useEffect(() => {
    if (trade) {
      reset({
        closeAmount: trade.remainingAmount,
        closePrice: currentPrice
      });
    }
  }, [trade, currentPrice, reset]);

  const handleFormSubmit = (data: CloseTradeInputs) => {
    if (trade) {
      onSubmit(trade.id, Number(data.closeAmount), Number(data.closePrice));
      reset();
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Close Trade
                </Dialog.Title>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Close Amount (BTC)
                      </label>
                      <input
                        type="number"
                        step="0.00000001"
                        max={trade?.remainingAmount}
                        {...register('closeAmount', {
                          required: 'Close amount is required',
                          min: { value: 0.00000001, message: 'Minimum amount is 0.00000001' },
                          max: { value: trade?.remainingAmount || 0, message: 'Cannot close more than remaining amount' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.closeAmount && (
                        <p className="mt-1 text-sm text-red-500">{errors.closeAmount.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Close Price (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('closePrice', {
                          required: 'Close price is required',
                          min: { value: 0.01, message: 'Minimum price is 0.01' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.closePrice && (
                        <p className="mt-1 text-sm text-red-500">{errors.closePrice.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Close Trade
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}