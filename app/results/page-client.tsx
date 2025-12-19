'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Results } from './_components/Results';
import { getCurrentDate } from '../lib/date';
import { BackButton } from '@/app/components/BackButton';

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
  const [bonds, setBonds] = useState<Bond[]>([]);
  // today is current date - for already purchased bonds, use actualPurchaseDate from bond
  const today = getCurrentDate();
  const [reinvestRate, setReinvestRate] = useState<number>(14);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBonds = window.localStorage.getItem('bonds_list');
      const savedReinvestRate = window.localStorage.getItem('bonds_reinvestRate');

      if (!savedBonds || JSON.parse(savedBonds).length === 0) {
        router.push('/');
        return;
      }

      setBonds(savedBonds ? JSON.parse(savedBonds) : []);
      setReinvestRate(savedReinvestRate ? parseFloat(savedReinvestRate) : 14);
    }
  }, [router]);

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
        const daysToRedemption = daysBetween(divDate, redemptionDateObj);
        const yearsToRedemption = daysToRedemption / 365;
        reinvestIncome += div.amount * (reinvestRate / 100) * yearsToRedemption;
      }
    });

    const totalReceived = bond.redemptionAmount + totalDividends + reinvestIncome;
    const profit = totalReceived - totalInvestment;
    const totalReturn = (profit / totalInvestment) * 100;
    const annualReturn = (totalReturn / yearsTotal);

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

  if (bonds.length === 0) {
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
