'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { BackButton } from '@/app/components/BackButton';
import { BondForm } from '../../_components/BondForm';
import { useHydrated, useLocalStorageValue, writeLocalStorage } from '@/app/_hooks/useLocalStorage';

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

export default function EditBondPage() {
  const router = useRouter();
  const params = useParams();
  const bondId = params?.id as string;
  const bondIndex = bondId ? parseInt(bondId, 10) : -1;

  const isHydrated = useHydrated();
  const savedBonds = useLocalStorageValue('bonds_list');
  const bonds = useMemo<Bond[]>(() => (savedBonds ? JSON.parse(savedBonds) : []), [savedBonds]);
  const bondToEdit = bondIndex >= 0 && bondIndex < bonds.length ? bonds[bondIndex] : null;

  // Invalid index or no bonds — redirect to home
  useEffect(() => {
    if (isHydrated && !bondToEdit) {
      router.push('/');
    }
  }, [isHydrated, bondToEdit, router]);

  if (!isHydrated || !bondToEdit) {
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

  return <EditBondForm key={bondIndex} bondIndex={bondIndex} bondToEdit={bondToEdit} />;
}

function EditBondForm({ bondIndex, bondToEdit }: { bondIndex: number; bondToEdit: Bond }) {
  const router = useRouter();

  const [currentBond, setCurrentBond] = useState<BondInput>(() => ({
    name: bondToEdit.name,
    price: bondToEdit.price.toString(),
    commission: bondToEdit.commission.toString(),
    redemptionAmount: bondToEdit.redemptionAmount.toString(),
    redemptionDate: bondToEdit.redemptionDate,
    dividends: bondToEdit.dividends,
    isAlreadyPurchased: bondToEdit.isAlreadyPurchased || false,
    actualPurchaseDate: bondToEdit.actualPurchaseDate
  }));

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

  const saveBond = () => {
    if (currentBond.name && currentBond.price && currentBond.redemptionDate && currentBond.redemptionAmount) {
      const savedBonds = window.localStorage.getItem('bonds_list');
      if (savedBonds) {
        const bonds: Bond[] = JSON.parse(savedBonds);
        if (bondIndex >= 0 && bondIndex < bonds.length) {
          const existing = bonds[bondIndex];
          bonds[bondIndex] = {
            name: currentBond.name,
            price: parseFloat(currentBond.price),
            commission: parseFloat(currentBond.commission) || 0,
            redemptionAmount: parseFloat(currentBond.redemptionAmount),
            redemptionDate: currentBond.redemptionDate,
            dividends: currentBond.dividends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            isAlreadyPurchased: currentBond.isAlreadyPurchased || false,
            actualPurchaseDate: currentBond.actualPurchaseDate,
            includedInCalculation: existing.includedInCalculation,
          };
          writeLocalStorage('bonds_list', JSON.stringify(bonds));
          router.push('/');
        }
      }
    }
  };

  const formatNumber = (num: number): string => num.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDate = (dateStr: string): string => new Date(dateStr).toLocaleDateString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric' });

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
            onAddBond={saveBond}
            formatDate={formatDate}
            formatNumber={formatNumber}
            title="Редагувати облігацію"
            renderActions={() => (
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2 text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Назад
                </button>
                <button
                  onClick={saveBond}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Зберегти зміни
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
