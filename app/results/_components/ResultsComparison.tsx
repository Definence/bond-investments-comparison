import React from 'react';
import { ResultsComparisonBlock } from './ResultsComparisonBlock';

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
  formatDate: (dateStr: string) => string;
};

export const ResultsComparison: React.FC<ResultsComparisonProps> = ({ results, formatDate }) => {
  const sortedResultsWithReinvest = [...results].sort(
    (a, b) => b.withReinvest.annualReturn - a.withReinvest.annualReturn
  );

  const sortedResultsWithoutReinvest = [...results].sort(
    (a, b) => b.withoutReinvest.annualReturn - a.withoutReinvest.annualReturn
  );

  // Calculate the maximum annual return for proper scaling
  const maxAnnualReturnWithReinvest = sortedResultsWithReinvest.length > 0
    ? Math.max(...sortedResultsWithReinvest.map(r => r.withReinvest.annualReturn))
    : 20; // Fallback to 20 if no results

  const maxAnnualReturnWithoutReinvest = sortedResultsWithoutReinvest.length > 0
    ? Math.max(...sortedResultsWithoutReinvest.map(r => r.withoutReinvest.annualReturn))
    : 20; // Fallback to 20 if no results

  return (
    <>
      <ResultsComparisonBlock
        title="Порівняння річної дохідності (з реінвестуванням):"
        sortedResults={sortedResultsWithReinvest}
        maxAnnualReturn={maxAnnualReturnWithReinvest}
        getAnnualReturn={(r) => r.withReinvest.annualReturn}
        formatDate={formatDate}
      />
      <ResultsComparisonBlock
        title="Порівняння річної дохідності (без реінвестування):"
        sortedResults={sortedResultsWithoutReinvest}
        maxAnnualReturn={maxAnnualReturnWithoutReinvest}
        getAnnualReturn={(r) => r.withoutReinvest.annualReturn}
        formatDate={formatDate}
      />
    </>
  );
};
