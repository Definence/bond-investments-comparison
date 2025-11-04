import React from 'react';
import { ResultsBestOptionCard } from './ResultsBestOptionCard';
import { ResultsComparison } from './ResultsComparison';

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

type ResultsSummaryProps = {
  results: BondResult[];
  formatNumber: (num: number) => string;
};

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results, formatNumber }) => {
  const bestWithoutReinvest = results.reduce((prev, curr) =>
    curr.withoutReinvest.annualReturn > prev.withoutReinvest.annualReturn ? curr : prev
  );

  const bestWithReinvest = results.reduce((prev, curr) =>
    curr.withReinvest.annualReturn > prev.withReinvest.annualReturn ? curr : prev
  );

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-gray-600 text-white">Підсумок: Найкращі варіанти</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur">
          <h3 className="font-bold text-lg mb-3 text-gray-600">БЕЗ реінвестування</h3>
          <ResultsBestOptionCard
            bondName={bestWithoutReinvest.bond.name}
            annualReturn={bestWithoutReinvest.withoutReinvest.annualReturn}
            profit={bestWithoutReinvest.withoutReinvest.profit}
            formatNumber={formatNumber}
          />
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur">
          <h3 className="font-bold text-lg mb-3 text-gray-600">З реінвестуванням</h3>
          <ResultsBestOptionCard
            bondName={bestWithReinvest.bond.name}
            annualReturn={bestWithReinvest.withReinvest.annualReturn}
            profit={bestWithReinvest.withReinvest.profit}
            formatNumber={formatNumber}
          />
        </div>
      </div>

      <ResultsComparison results={results} />
    </div>
  );
};
