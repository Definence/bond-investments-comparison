import React from 'react';
import { DateInput } from '../components/DateInput';
import { NumberInput } from '../components/NumberInput';

type HomeSettingsProps = {
  purchaseDate: string;
  onPurchaseDateChange: (value: string) => void;
  reinvestRate: number;
  onReinvestRateChange: (value: number) => void;
};

export const HomeSettings: React.FC<HomeSettingsProps> = ({
  purchaseDate,
  onPurchaseDateChange,
  reinvestRate,
  onReinvestRateChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-indigo-50 p-6 rounded-lg">
      <DateInput
        label="Дата покупки"
        value={purchaseDate}
        onChange={onPurchaseDateChange}
        focusColor="indigo"
      />
      <NumberInput
        label="Ставка реінвестування (% річних)"
        value={reinvestRate}
        onChange={(value) => onReinvestRateChange(typeof value === 'number' ? value : parseFloat(value) || 0)}
        focusColor="indigo"
      />
    </div>
  );
};
