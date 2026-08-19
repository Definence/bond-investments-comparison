import React from 'react';

type DateInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'normal' | 'small';
  focusColor?: 'purple' | 'indigo';
};

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(({
  label,
  value,
  onChange,
  className = '',
  size = 'normal',
  focusColor = 'purple',
}, ref) => {
  const padding = size === 'small' ? 'px-3' : 'px-4';
  const focusRing = focusColor === 'indigo'
    ? 'focus:ring-indigo-500 focus:border-indigo-500'
    : 'focus:ring-purple-500 focus:border-purple-500';

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${padding} py-2 bg-white ${value ? 'text-gray-900' : 'text-gray-500'} placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 ${focusRing}`}
      />
    </div>
  );
});

DateInput.displayName = 'DateInput';
