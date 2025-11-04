import React from 'react';
import { ResultsBondCard } from './ResultsBondCard';
import { ResultsSummary } from './ResultsSummary';

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

type ResultsProps = {
  results: BondResult[];
  reinvestRate: number;
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
};

export const Results: React.FC<ResultsProps> = ({
  results,
  reinvestRate,
  formatNumber,
  formatDate,
}) => {
  return (
    <>
      {results.map((result, idx) => (
        <ResultsBondCard
          key={idx}
          bond={result.bond}
          withoutReinvest={result.withoutReinvest}
          withReinvest={result.withReinvest}
          reinvestRate={reinvestRate}
          formatNumber={formatNumber}
          formatDate={formatDate}
        />
      ))}
      <ResultsSummary results={results} formatNumber={formatNumber} />
    </>
  );
};
