import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DateInput } from '../components/DateInput';
import { NumberInput } from '../components/NumberInput';

type Dividend = {
  date: string;
  amount: number;
};

type DividendsInputProps = {
  currentDividend: {
    date: string;
    amount: string;
  };
  setCurrentDividend: (dividend: { date: string; amount: string }) => void;
  dividends: Dividend[];
  onAddDividend: () => void;
  onRemoveDividend: (index: number) => void;
  formatDate: (dateStr: string) => string;
  formatNumber: (num: number) => string;
};

export const DividendsInput: React.FC<DividendsInputProps> = ({
  currentDividend,
  setCurrentDividend,
  dividends,
  onAddDividend,
  onRemoveDividend,
  formatDate,
  formatNumber,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg mb-4">
      <h3 className="font-semibold text-gray-800 mb-3">Дивіденди</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <DateInput
          label="Дата виплати"
          value={currentDividend.date}
          onChange={(value) => setCurrentDividend({...currentDividend, date: value})}
          size="small"
          className="md:col-span-1"
        />
        <NumberInput
          label="Сума (грн)"
          value={currentDividend.amount}
          onChange={(value) => setCurrentDividend({...currentDividend, amount: value as string})}
          placeholder="817.5"
          size="small"
          onChangeAsString={true}
          className="md:col-span-1"
        />
        <div className="flex items-end">
          <button
            onClick={onAddDividend}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Додати дивіденд
          </button>
        </div>
      </div>

      {dividends.length > 0 && (
        <div className="space-y-2">
          {dividends.map((div, index) => (
            <div key={index} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <div className="flex gap-4">
                <span className="font-medium text-gray-700">{formatDate(div.date)}</span>
                <span className="text-purple-600 font-semibold">{formatNumber(div.amount)} грн</span>
              </div>
              <button
                onClick={() => onRemoveDividend(index)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
