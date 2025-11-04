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

type ResultsComparisonProps = {
  results: BondResult[];
};

export const ResultsComparison: React.FC<ResultsComparisonProps> = ({ results }) => {
  const sortedResults = [...results].sort(
    (a, b) => b.withReinvest.annualReturn - a.withReinvest.annualReturn
  );

  return (
    <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
      <h3 className="font-semibold mb-2 text-gray-600">Порівняння річної дохідності (з реінвестуванням):</h3>
      <div className="space-y-2">
        {sortedResults.map((r, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-medium w-32 text-gray-600">{r.bond.name}:</span>
            <div className="flex-1 bg-white bg-opacity-30 rounded-full h-6 overflow-hidden">
              <div
                className="bg-yellow-300 h-full flex items-center justify-end pr-2"
                style={{ width: `${(r.withReinvest.annualReturn / 20) * 100}%` }}
              >
                <span className="text-xs font-bold text-gray-800">
                  {r.withReinvest.annualReturn.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
