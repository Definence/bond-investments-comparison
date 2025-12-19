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

type BondResult = {
  bond: Bond;
  withoutReinvest: ReturnCalculation;
  withReinvest: ReturnCalculation;
};

type ResultsComparisonBlockProps = {
  title: string;
  sortedResults: BondResult[];
  maxAnnualReturn: number;
  getAnnualReturn: (r: BondResult) => number;
  formatDate: (dateStr: string) => string;
};

export const ResultsComparisonBlock: React.FC<ResultsComparisonBlockProps> = ({
  title,
  sortedResults,
  maxAnnualReturn,
  getAnnualReturn,
  formatDate,
}) => {
  return (
    <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
      <h3 className="font-semibold mb-2 text-gray-600">{title}</h3>
      <div className="space-y-2">
        {sortedResults.map((r, idx) => {
          const annualReturn = getAnnualReturn(r);
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="font-medium w-48 text-gray-600">
                <div>{r.bond.name}</div>
                <div className="text-xs text-gray-500">{formatDate(r.bond.redemptionDate)}</div>
              </div>
              <div className="flex-1 bg-white bg-opacity-30 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-yellow-300 h-full flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((annualReturn / maxAnnualReturn) * 100, 100)}%` }}
                >
                  <span className="text-xs font-bold text-gray-800">
                    {annualReturn.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
