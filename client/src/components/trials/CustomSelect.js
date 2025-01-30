import React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const CustomSelect = ({
  options = [],
  placeholder = 'Select an option',
  onSelect = () => {},
  label = '',
  value = null,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(value);
  const containerRef = React.useRef(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const getDisplayText = (option) => {
    if (!option) return placeholder;
    return typeof option === 'object' ? option.label : option;
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mb-6">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-14 px-4
          flex items-center justify-between
          bg-[#002432] border border-[#003a4f]
          rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#004b66] focus:border-[#004b66]
          transition-colors duration-200
          ${isOpen ? 'border-[#004b66] ring-2 ring-[#004b66]' : 'hover:border-[#003a4f]'}
          ${className}
        `}
      >
        <span className={`text-sm ${selectedOption ? 'text-white' : 'text-gray-400'}`}>
          {getDisplayText(selectedOption)}
        </span>
        <div className="flex items-center justify-center w-8 h-8">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-[#002432] border border-[#003a4f] rounded-lg shadow-lg z-50">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              const isSelected = selectedOption === option;

              return (
                <div
                  key={optionValue}
                  onClick={() => handleSelect(option)}
                  className={`
                    flex items-center justify-between
                    px-4 py-3 cursor-pointer
                    ${index !== options.length - 1 ? 'border-b border-[#003a4f]' : ''}
                    ${isSelected ? 'bg-[#003a4f]' : 'hover:bg-[#003a4f]'}
                    transition-colors duration-150
                  `}
                >
                  <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
                    {optionLabel}
                  </span>
                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;