import React from 'react';
import { NumberInput } from '../components/NumberInput';

type HomeSettingsProps = {
  reinvestRate: number;
  onReinvestRateChange: (value: number) => void;
};

export const HomeSettings: React.FC<HomeSettingsProps> = ({
  reinvestRate,
  onReinvestRateChange,
}) => {
  return (
    <div className="mb-8 bg-indigo-50 p-6 rounded-lg w-full">
      <NumberInput
        className="w-1/2"
        label="Ставка реінвестування (% річних)"
        value={reinvestRate}
        onChange={(value) => onReinvestRateChange(typeof value === 'number' ? value : parseFloat(value) || 0)}
        focusColor="indigo"
      />
    </div>
  );
};
