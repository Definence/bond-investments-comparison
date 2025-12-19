'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomeSettings } from './_components/HomeSettings';
import { HomeBondsList } from './_components/HomeBondsList';
import { HomeHeader } from './_components/HomeHeader';
import { HomeActionButtons } from './_components/HomeActionButtons';

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
};

const BondsCalculator = () => {
  // Initialize with default values to ensure server/client match
  const [reinvestRate, setReinvestRate] = useState<number>(14);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);

    const savedReinvestRate = window.localStorage.getItem('bonds_reinvestRate');
    if (savedReinvestRate) {
      setReinvestRate(parseFloat(savedReinvestRate));
    }

    const savedBonds = window.localStorage.getItem('bonds_list');
    if (savedBonds) {
      setBonds(JSON.parse(savedBonds));
    }
  }, []);

  // Зберігання в localStorage при зміні (тільки після гідратації)
  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem('bonds_reinvestRate', reinvestRate.toString());
    }
  }, [reinvestRate, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem('bonds_list', JSON.stringify(bonds));
    }
  }, [bonds, isHydrated]);

  const router = useRouter();

  const removeBond = (index: number) => {
    setBonds(bonds.filter((_, i) => i !== index));
  };

  const clearAllData = () => {
    if (typeof window !== 'undefined' && window.confirm('Видалити всі збережені дані? Ця дія незворотна.')) {
      setBonds([]);
      setReinvestRate(14);
      window.localStorage.removeItem('bonds_list');
      window.localStorage.removeItem('bonds_reinvestRate');
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
        ]
      },
      {
        name: '16% дія',
        price: 10739.4,
        commission: 0,
        redemptionAmount: 12450,
        redemptionDate: '2026-11-18',
        dividends: []
      }
    ];
    setBonds(testBonds);
  };

  const formatNumber = (num: number): string => num.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <HomeHeader
            onClearAllData={clearAllData}
            onLoadTestData={loadTestData}
            hasBonds={bonds.length > 0}
          />

          <HomeSettings
            reinvestRate={reinvestRate}
            onReinvestRateChange={setReinvestRate}
          />

          <HomeBondsList
            bonds={bonds}
            onRemoveBond={removeBond}
            formatNumber={formatNumber}
          />

          <HomeActionButtons />
        </div>
      </div>
    </div>
  );
};

export default BondsCalculator;
