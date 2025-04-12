import { Chemical } from '@/types/inventory';

export const countExpiredChemicals = (chemicals: Chemical[]) => {
  const currentDate = new Date();

  return chemicals.filter((chemical: Chemical) => {
    const expirationDate = new Date(chemical.expires);
    return expirationDate < currentDate;
  }).length;
};

const LOW_STOCK_THRESHOLD = 300;

export const lowStockCount = (chemicals: Chemical[]) => {
  const lowStockChemicals = chemicals.filter(
    (chemical) => chemical.quantity < LOW_STOCK_THRESHOLD
  );

  return lowStockChemicals;
};
