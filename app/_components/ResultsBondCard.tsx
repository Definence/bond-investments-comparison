import React from 'react';
import { ResultsBondBasicParams } from './ResultsBondBasicParams';
import { ResultsBondDividends } from './ResultsBondDividends';
import { ResultsBondReturnCalculation } from './ResultsBondReturnCalculation';

type Bond = {
  name: string;
  price: number;
  commission: number;
  redemptionAmount: number;
  redemptionDate: string;
  dividends: Array<{ date: string; amount: number }>;
};

type ReturnCalculationData = {
  totalInvestment: number;
  totalDividends: number;
  reinvestIncome: number;
  totalReceived: number;
  profit: number;
  totalReturn: number;
  annualReturn: number;
  yearsTotal: number;
};

type ResultsBondCardProps = {
  bond: Bond;
  withoutReinvest: ReturnCalculationData;
  withReinvest: ReturnCalculationData;
  reinvestRate: number;
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
};

export const ResultsBondCard: React.FC<ResultsBondCardProps> = ({
  bond,
  withoutReinvest,
  withReinvest,
  reinvestRate,
  formatNumber,
  formatDate,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-gray-900">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">{bond.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ResultsBondBasicParams
          bond={bond}
          calculation={withoutReinvest}
          formatNumber={formatNumber}
          formatDate={formatDate}
        />
        <ResultsBondDividends
          dividends={bond.dividends}
          totalDividends={withoutReinvest.totalDividends}
          formatNumber={formatNumber}
          formatDate={formatDate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultsBondReturnCalculation
          calculation={withoutReinvest}
          formatNumber={formatNumber}
          variant="without"
        />
        <ResultsBondReturnCalculation
          calculation={withReinvest}
          reinvestRate={reinvestRate}
          showReinvestIncome={true}
          formatNumber={formatNumber}
          variant="with"
        />
      </div>
    </div>
  );
};
