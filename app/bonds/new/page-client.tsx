'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { BondForm } from '../_components/BondForm';
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

type BondInput = {
  name: string;
  price: string;
  commission: string;
  redemptionAmount: string;
  redemptionDate: string;
  dividends: Dividend[];
  isAlreadyPurchased?: boolean;
  actualPurchaseDate?: string;
};

export default function NewBondPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [bonds, setBonds] = useState<Bond[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      const savedBonds = window.localStorage.getItem('bonds_list');
      if (savedBonds) {
        setBonds(JSON.parse(savedBonds));
      }
    }
  }, []);

  const [currentBond, setCurrentBond] = useState<BondInput>({
    name: '',
    price: '',
    commission: '',
    redemptionAmount: '',
    redemptionDate: '',
    dividends: [],
    isAlreadyPurchased: false,
    actualPurchaseDate: undefined
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
      setCurrentDividend(prev => ({ ...prev, date: '' }));
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
      const newBonds = [...bonds, {
        name: currentBond.name,
        price: parseFloat(currentBond.price),
        commission: parseFloat(currentBond.commission) || 0,
        redemptionAmount: parseFloat(currentBond.redemptionAmount),
        redemptionDate: currentBond.redemptionDate,
        dividends: currentBond.dividends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        isAlreadyPurchased: currentBond.isAlreadyPurchased || false,
        actualPurchaseDate: currentBond.actualPurchaseDate
      }];
      setBonds(newBonds);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('bonds_list', JSON.stringify(newBonds));
      }
      router.push('/');
    }
  };

  const formatNumber = (num: number): string => num.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDate = (dateStr: string): string => new Date(dateStr).toLocaleDateString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric' });

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center text-gray-600">Завантаження...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="bg-white rounded-2xl shadow-xl p-8">
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
        </div>
      </div>
    </div>
  );
}
