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
  includedInCalculation: boolean;
};

type HomeBondsListProps = {
  bonds: Bond[];
  onRemoveBond: (index: number) => void;
  onToggleIncluded: (index: number) => void;
  formatNumber: (num: number) => string;
};

export const HomeBondsList: React.FC<HomeBondsListProps> = ({
  bonds,
  onRemoveBond,
  onToggleIncluded,
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
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg flex flex-wrap items-center gap-3 justify-between"
          >
            <label className="flex items-start gap-3 cursor-pointer min-w-0 flex-1">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
                checked={bond.includedInCalculation}
                onChange={() => onToggleIncluded(index)}
                title="У розрахунку"
              />
              <div className="min-w-0">
                <div className="font-semibold text-gray-800">{bond.name}</div>
                <div className="text-sm text-gray-700">
                  Ціна: {formatNumber(bond.price)} грн |
                  Погашення: {formatNumber(bond.redemptionAmount)} грн |
                  Дивідендів: {bond.dividends.length}
                </div>
              </div>
            </label>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => router.push(`/bonds/edit/${index}`)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Редагувати"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                type="button"
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
