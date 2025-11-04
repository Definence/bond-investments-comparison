import React from 'react';
import { TrendingUp, Trash2 } from 'lucide-react';

type Dividend = {
  date: string;
  amount: number;
};

type Bond = {
  name: string;
  price: number;
  commission: number;
  redemptionAmount: number;
  redemptionDate: string;
  dividends: Dividend[];
};

type BondsListProps = {
  bonds: Bond[];
  onRemoveBond: (index: number) => void;
  onShowResults: () => void;
  formatNumber: (num: number) => string;
};

export const BondsList: React.FC<BondsListProps> = ({
  bonds,
  onRemoveBond,
  onShowResults,
  formatNumber,
}) => {
  if (bonds.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Додані облігації ({bonds.length})</h2>
      <div className="space-y-3">
        {bonds.map((bond, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800">{bond.name}</div>
              <div className="text-sm text-gray-600">
                Ціна: {formatNumber(bond.price)} грн |
                Погашення: {formatNumber(bond.redemptionAmount)} грн |
                Дивідендів: {bond.dividends.length}
              </div>
            </div>
            <button
              onClick={() => onRemoveBond(index)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onShowResults}
        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-5 h-5" />
        Розрахувати та порівняти
      </button>
    </div>
  );
};
