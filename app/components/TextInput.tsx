import React from 'react';

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  focusColor?: 'purple' | 'indigo';
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className = '',
  focusColor = 'purple',
}) => {
  const focusRing = focusColor === 'indigo'
    ? 'focus:ring-indigo-500 focus:border-indigo-500'
    : 'focus:ring-purple-500 focus:border-purple-500';

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 ${focusRing}`}
      />
    </div>
  );
};
