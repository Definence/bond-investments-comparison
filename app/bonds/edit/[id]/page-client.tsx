'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { TextInput } from '@/app/components/TextInput';
import { NumberInput } from '@/app/components/NumberInput';
import { DateInput } from '@/app/components/DateInput';
import { HomeDividendsInput } from '@/app/_components/HomeDividendsInput';

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

export default function EditBondPage() {
  const router = useRouter();
  const params = useParams();
  const bondId = params?.id as string;
  const bondIndex = bondId ? parseInt(bondId, 10) : -1;

  const [isHydrated, setIsHydrated] = useState(false);
  const [bond, setBond] = useState<Bond | null>(null);
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

  // Load bond from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined' && bondIndex >= 0) {
      const savedBonds = window.localStorage.getItem('bonds_list');
      if (savedBonds) {
        const bonds: Bond[] = JSON.parse(savedBonds);
        if (bondIndex >= 0 && bondIndex < bonds.length) {
          const bondToEdit = bonds[bondIndex];
          setBond(bondToEdit);
          setCurrentBond({
            name: bondToEdit.name,
            price: bondToEdit.price.toString(),
            commission: bondToEdit.commission.toString(),
            redemptionAmount: bondToEdit.redemptionAmount.toString(),
            redemptionDate: bondToEdit.redemptionDate,
            dividends: bondToEdit.dividends
          });
        } else {
          // Invalid index, redirect to home
          router.push('/');
        }
      } else {
        // No bonds found, redirect to home
        router.push('/');
      }
    }
  }, [bondIndex, router]);

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

  const saveBond = () => {
    if (currentBond.name && currentBond.price && currentBond.redemptionDate && currentBond.redemptionAmount) {
      if (typeof window !== 'undefined' && bondIndex >= 0) {
        const savedBonds = window.localStorage.getItem('bonds_list');
        if (savedBonds) {
          const bonds: Bond[] = JSON.parse(savedBonds);
          if (bondIndex >= 0 && bondIndex < bonds.length) {
            bonds[bondIndex] = {
              name: currentBond.name,
              price: parseFloat(currentBond.price),
              commission: parseFloat(currentBond.commission) || 0,
              redemptionAmount: parseFloat(currentBond.redemptionAmount),
              redemptionDate: currentBond.redemptionDate,
              dividends: currentBond.dividends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            };
            window.localStorage.setItem('bonds_list', JSON.stringify(bonds));
            router.push('/');
          }
        }
      }
    }
  };

  const formatNumber = (num: number): string => num.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDate = (dateStr: string): string => new Date(dateStr).toLocaleDateString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric' });

  if (!isHydrated || !bond) {
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
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2 text-gray-700 hover:text-indigo-600"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Редагувати облігацію</h1>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextInput
                label="Назва"
                value={currentBond.name}
                onChange={(value: string) => setCurrentBond({...currentBond, name: value})}
                placeholder="Наприклад: 16% моно"
              />
              <NumberInput
                label="Ціна покупки (грн)"
                value={currentBond.price}
                onChange={(value: number | string) => setCurrentBond({...currentBond, price: value as string})}
                placeholder="10822"
                onChangeAsString={true}
              />
              <NumberInput
                label="Комісія (грн, необов'язково)"
                value={currentBond.commission}
                onChange={(value: number | string) => setCurrentBond({...currentBond, commission: value as string})}
                placeholder="0"
                onChangeAsString={true}
              />
              <NumberInput
                label="Сума погашення (грн)"
                value={currentBond.redemptionAmount}
                onChange={(value: number | string) => setCurrentBond({...currentBond, redemptionAmount: value as string})}
                placeholder="10817.5"
                onChangeAsString={true}
              />
              <DateInput
                label="Дата погашення"
                value={currentBond.redemptionDate}
                onChange={(value: string) => setCurrentBond({...currentBond, redemptionDate: value})}
              />
            </div>

            <HomeDividendsInput
              currentDividend={currentDividend}
              setCurrentDividend={setCurrentDividend}
              dividends={currentBond.dividends}
              onAddDividend={addDividend}
              onRemoveDividend={removeDividend}
              formatDate={formatDate}
              formatNumber={formatNumber}
            />

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
          </div>
        </div>
      </div>
    </div>
  );
}
