'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { HomeSettings } from './_components/HomeSettings';
import { HomeBondsList } from './_components/HomeBondsList';
import { HomeHeader } from './_components/HomeHeader';
import { HomeActionButtons } from './_components/HomeActionButtons';
import { useBondInclusion } from './_hooks/useBondInclusion';
import { useLocalStorageValue, writeLocalStorage } from './_hooks/useLocalStorage';

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
  isAlreadyPurchased?: boolean;
  actualPurchaseDate?: string;
  includedInCalculation: boolean;
};

const BondsCalculator = () => {
  // Стан живе в localStorage; на сервері та до гідратації видно дефолти
  const savedReinvestRate = useLocalStorageValue('bonds_reinvestRate');
  const savedBonds = useLocalStorageValue('bonds_list');

  const reinvestRate = savedReinvestRate ? parseFloat(savedReinvestRate) : 14;
  const bonds = useMemo<Bond[]>(() => (savedBonds ? JSON.parse(savedBonds) : []), [savedBonds]);

  const setReinvestRate = useCallback((value: number) => {
    writeLocalStorage('bonds_reinvestRate', value.toString());
  }, []);

  const setBonds: Dispatch<SetStateAction<Bond[]>> = useCallback((action) => {
    const raw = window.localStorage.getItem('bonds_list');
    const current: Bond[] = raw ? JSON.parse(raw) : [];
    const next = typeof action === 'function' ? action(current) : action;
    writeLocalStorage('bonds_list', JSON.stringify(next));
  }, []);

  const removeBond = (index: number) => {
    setBonds((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllData = () => {
    if (window.confirm('Видалити всі збережені дані? Ця дія незворотна.')) {
      writeLocalStorage('bonds_list', null);
      writeLocalStorage('bonds_reinvestRate', null);
    }
  };

  const loadTestData = () => {
    const testBonds: Bond[] = [
      {
        name: '16% моно',
        price: 10822,
        commission: 0,
        redemptionAmount: 10817.5,
        redemptionDate: '2026-11-18',
        dividends: [
          { date: '2025-11-19', amount: 817.5 },
          { date: '2026-05-20', amount: 817.5 }
        ],
        includedInCalculation: true
      },
      {
        name: '16% дія',
        price: 10739.4,
        commission: 0,
        redemptionAmount: 12450,
        redemptionDate: '2026-11-18',
        dividends: [],
        includedInCalculation: true
      }
    ];
    setBonds(testBonds);
  };

  const {
    toggleIncluded,
    selectAllIncluded,
    deselectAllIncluded,
    hasAnyIncludedForCalculation,
  } = useBondInclusion(bonds, setBonds);

  const formatNumber = (num: number): string => num.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <HomeHeader
            onClearAllData={clearAllData}
            onLoadTestData={loadTestData}
            hasBonds={bonds.length > 0}
            onSelectAll={selectAllIncluded}
            onDeselectAll={deselectAllIncluded}
          />

          <HomeSettings
            reinvestRate={reinvestRate}
            onReinvestRateChange={setReinvestRate}
          />

          <HomeBondsList
            bonds={bonds}
            onRemoveBond={removeBond}
            onToggleIncluded={toggleIncluded}
            formatNumber={formatNumber}
          />

          <HomeActionButtons canNavigateToResults={hasAnyIncludedForCalculation} />
        </div>
      </div>
    </div>
  );
};

export default BondsCalculator;
