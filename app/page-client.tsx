'use client';

import React, { useState, useEffect } from 'react';
import { Settings } from './_components/Settings';
import { Results } from './_components/Results';
import { BondsList } from './_components/BondsList';
import { BondForm } from './_components/BondForm';
import { Header } from './_components/Header';

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

type BondInput = {
  name: string;
  price: string;
  commission: string;
  redemptionAmount: string;
  redemptionDate: string;
  dividends: Dividend[];
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

const BondsCalculator = () => {
  const [purchaseDate, setPurchaseDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('bonds_purchaseDate');
      return saved || '2025-10-31';
    }
    return '2025-10-31';
  });

  const [reinvestRate, setReinvestRate] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('bonds_reinvestRate');
      return saved ? parseFloat(saved) : 14;
    }
    return 14;
  });

  const [bonds, setBonds] = useState<Bond[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('bonds_list');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [showResults, setShowResults] = useState(false);

  // Зберігання в localStorage при зміні
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bonds_purchaseDate', purchaseDate);
    }
  }, [purchaseDate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bonds_reinvestRate', reinvestRate.toString());
    }
  }, [reinvestRate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bonds_list', JSON.stringify(bonds));
    }
  }, [bonds]);

  const [currentBond, setCurrentBond] = useState<BondInput>({
    name: '',
    price: '',
    commission: '',
    redemptionAmount: '',
    redemptionDate: '',
    dividends: []
  });

  const [currentDividend, setCurrentDividend] = useState({
    date: '',
    amount: ''
  });

  const addDividend = () => {
    if (currentDividend.date && currentDividend.amount) {
      setCurrentBond({
        ...currentBond,
        dividends: [...currentBond.dividends, {
          date: currentDividend.date,
          amount: parseFloat(currentDividend.amount)
        }]
      });
      setCurrentDividend({ date: '', amount: '' });
    }
  };

  const removeDividend = (index: number) => {
    setCurrentBond({
      ...currentBond,
      dividends: currentBond.dividends.filter((_, i) => i !== index)
    });
  };

  const addBond = () => {
    if (currentBond.name && currentBond.price && currentBond.redemptionDate && currentBond.redemptionAmount) {
      setBonds([...bonds, {
        name: currentBond.name,
        price: parseFloat(currentBond.price),
        commission: parseFloat(currentBond.commission) || 0,
        redemptionAmount: parseFloat(currentBond.redemptionAmount),
        redemptionDate: currentBond.redemptionDate,
        dividends: currentBond.dividends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }]);
      setCurrentBond({
        name: '',
        price: '',
        commission: '',
        redemptionAmount: '',
        redemptionDate: '',
        dividends: []
      });
    }
  };

  const removeBond = (index: number) => {
    setBonds(bonds.filter((_, i) => i !== index));
  };

  const clearAllData = () => {
    if (typeof window !== 'undefined' && window.confirm('Видалити всі збережені дані? Ця дія незворотна.')) {
      setBonds([]);
      setPurchaseDate('2025-10-31');
      setReinvestRate(14);
      setShowResults(false);
      window.localStorage.removeItem('bonds_list');
      window.localStorage.removeItem('bonds_purchaseDate');
      window.localStorage.removeItem('bonds_reinvestRate');
    }
  };

  const daysBetween = (date1: Date, date2: Date): number => {
    const diff = date2.getTime() - date1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const calculateReturns = (bond: Bond, withReinvest: boolean): ReturnCalculation => {
    const purchaseDateObj = new Date(purchaseDate);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <Header
            onClearAllData={clearAllData}
            hasBonds={bonds.length > 0}
          />

          <Settings
            purchaseDate={purchaseDate}
            onPurchaseDateChange={setPurchaseDate}
            reinvestRate={reinvestRate}
            onReinvestRateChange={setReinvestRate}
          />

          <BondForm
            currentBond={currentBond}
            setCurrentBond={setCurrentBond}
            currentDividend={currentDividend}
            setCurrentDividend={setCurrentDividend}
            onAddDividend={addDividend}
            onRemoveDividend={removeDividend}
            onAddBond={addBond}
            formatDate={formatDate}
            formatNumber={formatNumber}
          />

          <BondsList
            bonds={bonds}
            onRemoveBond={removeBond}
            onShowResults={() => setShowResults(true)}
            formatNumber={formatNumber}
          />
        </div>

        {showResults && bonds.length > 0 && (
          <Results
            results={results}
            reinvestRate={reinvestRate}
            formatNumber={formatNumber}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default BondsCalculator;
