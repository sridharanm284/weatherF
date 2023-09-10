import React, { useState } from 'react';
import './styles/_index.scss';

interface Option {
  value: string;
  label: string;
}

interface AwesomeSelectProps {
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const AwesomeSelect: React.FC<AwesomeSelectProps> = ({
  options,
  defaultValue,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || '');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="awesome-select">
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className="select-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AwesomeSelect;