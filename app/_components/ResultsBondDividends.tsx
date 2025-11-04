import React from 'react';

type Dividend = {
  date: string;
  amount: number;
};

type ResultsBondDividendsProps = {
  dividends: Dividend[];
  totalDividends: number;
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
};

export const ResultsBondDividends: React.FC<ResultsBondDividendsProps> = ({
  dividends,
  totalDividends,
  formatNumber,
  formatDate,
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-700 mb-3">Дивіденди ({dividends.length} виплат)</h3>
      <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
        {dividends.map((div, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-800">{formatDate(div.date)}:</span>
            <span className="font-semibold text-blue-600">{formatNumber(div.amount)} грн</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-800">Всього дивідендів:</span>
          <span className="font-bold text-blue-600">{formatNumber(totalDividends)} грн</span>
        </div>
      </div>
    </div>
  );
};
