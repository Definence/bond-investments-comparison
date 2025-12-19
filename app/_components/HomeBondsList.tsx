'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';

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

type HomeBondsListProps = {
  bonds: Bond[];
  onRemoveBond: (index: number) => void;
  formatNumber: (num: number) => string;
};

export const HomeBondsList: React.FC<HomeBondsListProps> = ({
  bonds,
  onRemoveBond,
  formatNumber,
}) => {
  const router = useRouter();
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
              <div className="text-sm text-gray-700">
                Ціна: {formatNumber(bond.price)} грн |
                Погашення: {formatNumber(bond.redemptionAmount)} грн |
                Дивідендів: {bond.dividends.length}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/bonds/edit/${index}`)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Редагувати"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onRemoveBond(index)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Видалити"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
