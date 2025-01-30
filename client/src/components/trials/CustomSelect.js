import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa'; // For icons
import styled from 'styled-components';

const CustomSelect = ({
  options = [],
  placeholder = 'Select an option',
  onSelect = () => {},
  label = '',
  value = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const getDisplayText = (option) => {
    if (!option) return placeholder;
    return typeof option === 'object' ? option.label : option;
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <SelectButton onClick={() => setIsOpen(!isOpen)}>
        <SelectText isSelected={!!selectedOption}>
          {getDisplayText(selectedOption)}
        </SelectText>
        <IconContainer>
          {isOpen ? (
            <FaChevronUp size={24} color="#94A3B8" />
          ) : (
            <FaChevronDown size={24} color="#94A3B8" />
          )}
        </IconContainer>
      </SelectButton>

      {isOpen && (
        <OptionsContainer>
          {options.map((option, index) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            const isSelected = selectedOption === option;
            const isLast = index === options.length - 1;

            return (
              <Option
                key={optionValue}
                onClick={() => handleSelect(option)}
                isSelected={isSelected}
                isLast={isLast}
              >
                <OptionText isSelected={isSelected}>{optionLabel}</OptionText>
                {isSelected && <FaCheck size={20} color="#3B82F6" />}
              </Option>
            );
          })}
        </OptionsContainer>
      )}
    </Container>
  );
};

export default CustomSelect;

const Container = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
`;

const SelectButton = styled.button`
  height: 56px;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`;

const SelectText = styled.span`
  font-size: 16px;
  color: ${({ isSelected }) => (isSelected ? '#1E293B' : '#94A3B8')};
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconContainer = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OptionsContainer = styled.div`
  margin-top: 8px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  z-index: 999;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background-color: ${({ isSelected }) => (isSelected ? '#F1F5F9' : 'transparent')};
  cursor: pointer;
  &:hover {
    background-color: #f1f5f9;
  }
  ${({ isLast }) => isLast && `border-bottom: none;`}
`;

const OptionText = styled.span`
  font-size: 16px;
  color: ${({ isSelected }) => (isSelected ? '#3B82F6' : '#1E293B')};
  font-weight: ${({ isSelected }) => (isSelected ? '500' : 'normal')};
`;
