import React from 'react';

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

type ResultsBondReturnCalculationProps = {
  calculation: ReturnCalculation;
  reinvestRate?: number;
  showReinvestIncome?: boolean;
  formatNumber: (num: number) => string;
  variant?: 'without' | 'with';
};

export const ResultsBondReturnCalculation: React.FC<ResultsBondReturnCalculationProps> = ({
  calculation,
  reinvestRate,
  showReinvestIncome = false,
  formatNumber,
  variant = 'without',
}) => {
  const isWithReinvest = variant === 'with';
  const bgClass = isWithReinvest
    ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300'
    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200';
  const titleClass = isWithReinvest ? 'text-green-800' : 'text-gray-800';
  const returnClass = isWithReinvest ? 'text-green-800' : 'text-gray-800';
  const annualReturnClass = isWithReinvest ? 'text-green-600' : 'text-indigo-600';
  const borderClass = isWithReinvest ? 'border-green-300' : 'border-gray-200';

  return (
    <div className={`${bgClass} p-6 rounded-lg`}>
      <h3 className={`font-bold text-lg ${titleClass} mb-4`}>
        {isWithReinvest ? `З реінвестуванням (${reinvestRate}%)` : 'БЕЗ реінвестування'}
      </h3>
      <div className="space-y-3">
        {showReinvestIncome && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-800">Дохід від реінвестування:</span>
            <span className="font-semibold text-green-600">+{formatNumber(calculation.reinvestIncome)} грн</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-800">Всього отримаєте:</span>
          <span className="font-semibold text-gray-900">{formatNumber(calculation.totalReceived)} грн</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-800">Прибуток:</span>
          <span className="font-semibold text-green-600">{formatNumber(calculation.profit)} грн</span>
        </div>
        <div className={`border-t-2 ${borderClass} pt-3`}>
          <div className="flex justify-between mb-2">
            <span className="text-gray-800 font-medium">Дохідність:</span>
            <span className={`font-bold text-xl ${returnClass}`}>{calculation.totalReturn.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">Річна дохідність:</span>
            <span className={`font-bold text-2xl ${annualReturnClass}`}>{calculation.annualReturn.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
