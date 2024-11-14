export async function getCurrentBitcoinPrice(): Promise<number> {
  const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
  const data = await response.json();
  return parseFloat(data.data.amount);
} 