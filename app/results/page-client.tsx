'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Results } from './_components/Results';
import { getCurrentDate } from '../lib/date';
import { BackButton } from '@/app/components/BackButton';
import { useHydrated, useLocalStorageValue } from '@/app/_hooks/useLocalStorage';

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

type ReturnCalculation = {
  totalInvestment: number;
  totalDividends: number;
  reinvestIncome: number;
  totalReceived: number;
  profit: number;
  totalReturn: number;
  annualReturn: number;
  yearsTotal: number;
};

export default function ResultsPage() {
  const router = useRouter();
  // today is current date - for already purchased bonds, use actualPurchaseDate from bond
  const today = getCurrentDate();

  const isHydrated = useHydrated();
  const savedBonds = useLocalStorageValue('bonds_list');
  const savedReinvestRate = useLocalStorageValue('bonds_reinvestRate');

  const reinvestRate = savedReinvestRate ? parseFloat(savedReinvestRate) : 14;
  const bonds = useMemo<Bond[]>(() => {
    const parsed: Bond[] = savedBonds ? JSON.parse(savedBonds) : [];
    return parsed.filter((b) => b.includedInCalculation);
  }, [savedBonds]);

  // Нема чого рахувати — повертаємось на головну
  useEffect(() => {
    if (isHydrated && bonds.length === 0) {
      router.push('/');
    }
  }, [isHydrated, bonds.length, router]);

  const daysBetween = (date1: Date, date2: Date): number => {
    const diff = date2.getTime() - date1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const calculateReturns = (bond: Bond, withReinvest: boolean): ReturnCalculation => {
    const effectivePurchaseDate = bond.isAlreadyPurchased && bond.actualPurchaseDate
      ? bond.actualPurchaseDate
      : today;
    const purchaseDateObj = new Date(effectivePurchaseDate);
    const redemptionDateObj = new Date(bond.redemptionDate);
    const totalInvestment = bond.price + bond.commission;
    const daysTotal = daysBetween(purchaseDateObj, redemptionDateObj);
    const yearsTotal = daysTotal / 365;

    let totalDividends = 0;
    let reinvestIncome = 0;

    bond.dividends.forEach((div: Dividend) => {
      const divDate = new Date(div.date);
      totalDividends += div.amount;

      if (withReinvest) {
        const daysToRedemption = Math.max(daysBetween(divDate, redemptionDateObj), 0);
        const yearsToRedemption = daysToRedemption / 365;
        // Складний відсоток: купон реінвестується з капіталізацією до дати погашення
        reinvestIncome += div.amount * (Math.pow(1 + reinvestRate / 100, yearsToRedemption) - 1);
      }
    });

    const totalReceived = bond.redemptionAmount + totalDividends + reinvestIncome;
    const profit = totalReceived - totalInvestment;
    const totalReturn = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
    // CAGR — еквівалентна ставка депозиту з капіталізацією
    const annualReturn = totalInvestment > 0 && totalReceived > 0 && yearsTotal > 0
      ? (Math.pow(totalReceived / totalInvestment, 1 / yearsTotal) - 1) * 100
      : 0;

    return {
      totalInvestment,
      totalDividends,
      reinvestIncome,
      totalReceived,
      profit,
      totalReturn,
      annualReturn,
      yearsTotal
    };
  };

  const formatNumber = (num: number): string => num.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDate = (dateStr: string): string => new Date(dateStr).toLocaleDateString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric' });

  type BondResult = {
    bond: Bond;
    withoutReinvest: ReturnCalculation;
    withReinvest: ReturnCalculation;
  };

  const results: BondResult[] = bonds.map((bond: Bond) => ({
    bond,
    withoutReinvest: calculateReturns(bond, false),
    withReinvest: calculateReturns(bond, true)
  }));

  if (!isHydrated || bonds.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton text="Назад до основної сторінки" />

        <Results
          results={results}
          reinvestRate={reinvestRate}
          formatNumber={formatNumber}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
