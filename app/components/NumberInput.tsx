import React from 'react';

type NumberInputProps = {
  label: string;
  value: string | number;
  onChange: (value: number | string) => void;
  onChangeAsString?: boolean;
  placeholder?: string;
  className?: string;
  focusColor?: 'purple' | 'indigo';
  size?: 'normal' | 'small';
};

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  onChangeAsString = false,
  placeholder,
  className = '',
  focusColor = 'purple',
  size = 'normal',
}) => {
  const focusRing = focusColor === 'indigo'
    ? 'focus:ring-indigo-500 focus:border-indigo-500'
    : 'focus:ring-purple-500 focus:border-purple-500';
  const padding = size === 'small' ? 'px-3' : 'px-4';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeAsString) {
      onChange(e.target.value);
    } else {
      onChange(parseFloat(e.target.value) || 0);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full ${padding} py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 ${focusRing}`}
      />
    </div>
  );
};
