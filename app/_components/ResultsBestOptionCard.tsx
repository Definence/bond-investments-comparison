import React from 'react';

type ResultsBestOptionCardProps = {
  bondName: string;
  annualReturn: number;
  profit: number;
  formatNumber: (num: number) => string;
};

export const ResultsBestOptionCard: React.FC<ResultsBestOptionCardProps> = ({
  bondName,
  annualReturn,
  profit,
  formatNumber,
}) => {
  return (
    <div className="text-gray-600">
      <div className="text-3xl font-bold mb-2">{bondName}</div>
      <div className="text-xl">Річна дохідність: {annualReturn.toFixed(2)}%</div>
      <div className="text-sm mt-2">Прибуток: {formatNumber(profit)} грн</div>
    </div>
  );
};
