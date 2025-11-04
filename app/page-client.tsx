'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2, Calculator } from 'lucide-react';
import { TextInput } from './components/TextInput';
import { NumberInput } from './components/NumberInput';
import { DateInput } from './components/DateInput';
import { DividendsInput } from './_components/DividendsInput';

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Калькулятор облігацій</h1>
            </div>
            {bonds.length > 0 && (
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Очистити всі дані
              </button>
            )}
          </div>

          {/* Налаштування */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-indigo-50 p-6 rounded-lg">
            <DateInput
              label="Дата покупки"
              value={purchaseDate}
              onChange={setPurchaseDate}
              focusColor="indigo"
            />
            <NumberInput
              label="Ставка реінвестування (% річних)"
              value={reinvestRate}
              onChange={(value) => setReinvestRate(typeof value === 'number' ? value : parseFloat(value) || 0)}
              focusColor="indigo"
            />
          </div>

          {/* Форма додавання облігації */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Додати облігацію</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextInput
                label="Назва"
                value={currentBond.name}
                onChange={(value) => setCurrentBond({...currentBond, name: value})}
                placeholder="Наприклад: 16% моно"
              />
              <NumberInput
                label="Ціна покупки (грн)"
                value={currentBond.price}
                onChange={(value) => setCurrentBond({...currentBond, price: value as string})}
                placeholder="10822"
                onChangeAsString={true}
              />
              <NumberInput
                label="Комісія (грн, необов'язково)"
                value={currentBond.commission}
                onChange={(value) => setCurrentBond({...currentBond, commission: value as string})}
                placeholder="0"
                onChangeAsString={true}
              />
              <NumberInput
                label="Сума погашення (грн)"
                value={currentBond.redemptionAmount}
                onChange={(value) => setCurrentBond({...currentBond, redemptionAmount: value as string})}
                placeholder="10817.5"
                onChangeAsString={true}
              />
              <DateInput
                label="Дата погашення"
                value={currentBond.redemptionDate}
                onChange={(value) => setCurrentBond({...currentBond, redemptionDate: value})}
              />
            </div>

            <DividendsInput
              currentDividend={currentDividend}
              setCurrentDividend={setCurrentDividend}
              dividends={currentBond.dividends}
              onAddDividend={addDividend}
              onRemoveDividend={removeDividend}
              formatDate={formatDate}
              formatNumber={formatNumber}
            />

            <button
              onClick={addBond}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Додати облігацію до порівняння
            </button>
          </div>

          {/* Список доданих облігацій */}
          {bonds.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Додані облігації ({bonds.length})</h2>
              <div className="space-y-3">
                {bonds.map((bond, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{bond.name}</div>
                      <div className="text-sm text-gray-600">
                        Ціна: {formatNumber(bond.price)} грн |
                        Погашення: {formatNumber(bond.redemptionAmount)} грн |
                        Дивідендів: {bond.dividends.length}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBond(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowResults(true)}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Розрахувати та порівняти
              </button>
            </div>
          )}
        </div>

        {/* Результати */}
        {showResults && bonds.length > 0 && (
          <>
            {results.map((result, idx) => {
              const bond = result.bond;
              const noReinv = result.withoutReinvest;
              const withReinv = result.withReinvest;

              return (
                <div key={idx} className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                  <h2 className="text-2xl font-bold text-indigo-600 mb-6">{bond.name}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">Базові параметри</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ціна покупки:</span>
                          <span className="font-semibold">{formatNumber(bond.price)} грн</span>
                        </div>
                        {bond.commission > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Комісія:</span>
                            <span className="font-semibold text-red-600">{formatNumber(bond.commission)} грн</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Всього інвестиція:</span>
                          <span className="font-bold">{formatNumber(noReinv.totalInvestment)} грн</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Дата погашення:</span>
                          <span className="font-semibold">{formatDate(bond.redemptionDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Термін:</span>
                          <span className="font-semibold">{noReinv.yearsTotal.toFixed(2)} років</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Сума погашення:</span>
                          <span className="font-semibold">{formatNumber(bond.redemptionAmount)} грн</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">Дивіденди ({bond.dividends.length} виплат)</h3>
                      <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                        {bond.dividends.map((div, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-gray-600">{formatDate(div.date)}:</span>
                            <span className="font-semibold text-blue-600">{formatNumber(div.amount)} грн</span>
                          </div>
                        ))}
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Всього дивідендів:</span>
                          <span className="font-bold text-blue-600">{formatNumber(noReinv.totalDividends)} грн</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-gray-200">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">БЕЗ реінвестування</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Всього отримаєте:</span>
                          <span className="font-semibold">{formatNumber(noReinv.totalReceived)} грн</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Прибуток:</span>
                          <span className="font-semibold text-green-600">{formatNumber(noReinv.profit)} грн</span>
                        </div>
                        <div className="border-t-2 pt-3">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-700 font-medium">Дохідність:</span>
                            <span className="font-bold text-xl text-gray-800">{noReinv.totalReturn.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">Річна дохідність:</span>
                            <span className="font-bold text-2xl text-indigo-600">{noReinv.annualReturn.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border-2 border-green-300">
                      <h3 className="font-bold text-lg text-green-800 mb-4">З реінвестуванням ({reinvestRate}%)</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Дохід від реінвестування:</span>
                          <span className="font-semibold text-green-600">+{formatNumber(withReinv.reinvestIncome)} грн</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Всього отримаєте:</span>
                          <span className="font-semibold">{formatNumber(withReinv.totalReceived)} грн</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Прибуток:</span>
                          <span className="font-semibold text-green-600">{formatNumber(withReinv.profit)} грн</span>
                        </div>
                        <div className="border-t-2 border-green-300 pt-3">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-700 font-medium">Дохідність:</span>
                            <span className="font-bold text-xl text-green-800">{withReinv.totalReturn.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">Річна дохідність:</span>
                            <span className="font-bold text-2xl text-green-600">{withReinv.annualReturn.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Підсумок: Найкращі варіанти</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur">
                  <h3 className="font-bold text-lg mb-3">БЕЗ реінвестування</h3>
                  {(() => {
                    const best = results.reduce((prev: BondResult, curr: BondResult) =>
                      curr.withoutReinvest.annualReturn > prev.withoutReinvest.annualReturn ? curr : prev
                    );
                    return (
                      <div>
                        <div className="text-3xl font-bold mb-2">{best.bond.name}</div>
                        <div className="text-xl">Річна дохідність: {best.withoutReinvest.annualReturn.toFixed(2)}%</div>
                        <div className="text-sm mt-2 opacity-90">Прибуток: {formatNumber(best.withoutReinvest.profit)} грн</div>
                      </div>
                    );
                  })()}
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur">
                  <h3 className="font-bold text-lg mb-3">З реінвестуванням</h3>
                  {(() => {
                    const best = results.reduce((prev: BondResult, curr: BondResult) =>
                      curr.withReinvest.annualReturn > prev.withReinvest.annualReturn ? curr : prev
                    );
                    return (
                      <div>
                        <div className="text-3xl font-bold mb-2">{best.bond.name}</div>
                        <div className="text-xl">Річна дохідність: {best.withReinvest.annualReturn.toFixed(2)}%</div>
                        <div className="text-sm mt-2 opacity-90">Прибуток: {formatNumber(best.withReinvest.profit)} грн</div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
                <h3 className="font-semibold mb-2">Порівняння річної дохідності (з реінвестуванням):</h3>
                <div className="space-y-2">
                  {results
                    .sort((a: BondResult, b: BondResult) => b.withReinvest.annualReturn - a.withReinvest.annualReturn)
                    .map((r: BondResult, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="font-medium w-32">{r.bond.name}:</span>
                      <div className="flex-1 bg-white bg-opacity-30 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-yellow-300 h-full flex items-center justify-end pr-2"
                          style={{ width: `${(r.withReinvest.annualReturn / 20) * 100}%` }}
                        >
                          <span className="text-xs font-bold text-gray-800">{r.withReinvest.annualReturn.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BondsCalculator;
