import React from 'react';
import { Plus } from 'lucide-react';
import { TextInput } from '../components/TextInput';
import { NumberInput } from '../components/NumberInput';
import { DateInput } from '../components/DateInput';
import { DividendsInput } from './DividendsInput';

type Dividend = {
  date: string;
  amount: number;
};

type BondInput = {
  name: string;
  price: string;
  commission: string;
  redemptionAmount: string;
  redemptionDate: string;
  dividends: Dividend[];
};

type BondFormProps = {
  currentBond: BondInput;
  setCurrentBond: (bond: BondInput) => void;
  currentDividend: {
    date: string;
    amount: string;
  };
  setCurrentDividend: (dividend: { date: string; amount: string }) => void;
  onAddDividend: () => void;
  onRemoveDividend: (index: number) => void;
  onAddBond: () => void;
  formatDate: (dateStr: string) => string;
  formatNumber: (num: number) => string;
};

export const BondForm: React.FC<BondFormProps> = ({
  currentBond,
  setCurrentBond,
  currentDividend,
  setCurrentDividend,
  onAddDividend,
  onRemoveDividend,
  onAddBond,
  formatDate,
  formatNumber,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Додати облігацію</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TextInput
          label="Назва"
          value={currentBond.name}
          onChange={(value) => setCurrentBond({...currentBond, name: value})}
          placeholder="Наприклад: 16% моно"
        />
        <NumberInput
          label="Ціна покупки (грн)"
          value={currentBond.price}
          onChange={(value) => setCurrentBond({...currentBond, price: value as string})}
          placeholder="10822"
          onChangeAsString={true}
        />
        <NumberInput
          label="Комісія (грн, необов'язково)"
          value={currentBond.commission}
          onChange={(value) => setCurrentBond({...currentBond, commission: value as string})}
          placeholder="0"
          onChangeAsString={true}
        />
        <NumberInput
          label="Сума погашення (грн)"
          value={currentBond.redemptionAmount}
          onChange={(value) => setCurrentBond({...currentBond, redemptionAmount: value as string})}
          placeholder="10817.5"
          onChangeAsString={true}
        />
        <DateInput
          label="Дата погашення"
          value={currentBond.redemptionDate}
          onChange={(value) => setCurrentBond({...currentBond, redemptionDate: value})}
        />
      </div>

      <DividendsInput
        currentDividend={currentDividend}
        setCurrentDividend={setCurrentDividend}
        dividends={currentBond.dividends}
        onAddDividend={onAddDividend}
        onRemoveDividend={onRemoveDividend}
        formatDate={formatDate}
        formatNumber={formatNumber}
      />

      <button
        onClick={onAddBond}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Додати облігацію до порівняння
      </button>
    </div>
  );
};
