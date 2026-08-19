import React from 'react';

type Bond = {
  name: string;
  price: number;
  commission: number;
  redemptionAmount: number;
  redemptionDate: string;
  dividends: Array<{ date: string; amount: number }>;
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

type ResultsBondBasicParamsProps = {
  bond: Bond;
  calculation: ReturnCalculation;
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
};

export const ResultsBondBasicParams: React.FC<ResultsBondBasicParamsProps> = ({
  bond,
  calculation,
  formatNumber,
  formatDate,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-700 mb-3">Базові параметри</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-800">Ціна покупки:</span>
          <span className="font-semibold text-gray-900">{formatNumber(bond.price)} грн</span>
        </div>
        {bond.commission > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-800">Комісія:</span>
            <span className="font-semibold text-red-600">{formatNumber(bond.commission)} грн</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-800">Всього інвестиція:</span>
          <span className="font-bold text-gray-900">{formatNumber(calculation.totalInvestment)} грн</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-800">Дата погашення:</span>
          <span className="font-semibold text-gray-900">{formatDate(bond.redemptionDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-800">Термін:</span>
          <span className="font-semibold text-gray-900">{calculation.yearsTotal.toFixed(2)} років</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-800">Сума погашення:</span>
          <span className="font-semibold text-gray-900">{formatNumber(bond.redemptionAmount)} грн</span>
        </div>
      </div>
    </div>
  );
};
