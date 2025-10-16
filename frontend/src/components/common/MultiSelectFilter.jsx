// components/common/MultiSelectFilter.jsx
import React, { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "../ui/button";

const MultiSelectFilter = ({
  options,
  selectedValues = [],
  onChange,
  placeholder = "Select options",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const clearAll = () => {
    onChange([]);
  };

  const removeValue = (value, e) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== value);
    onChange(newValues);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between border-gray-600 text-gray-300 hover:bg-gray-700"
      >
        <div className="flex items-center space-x-2 flex-wrap gap-1">
          {selectedValues.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs"
                >
                  {option?.label}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={(e) => removeValue(value, e)}
                  />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            {selectedValues.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full text-left px-2 py-1 text-sm text-red-400 hover:bg-gray-700 rounded mb-1"
              >
                Clear all
              </button>
            )}
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className="flex items-center px-2 py-2 hover:bg-gray-700 rounded cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border border-gray-500 rounded mr-2 flex items-center justify-center ${
                    selectedValues.includes(option.value)
                      ? "bg-blue-500 border-blue-500"
                      : ""
                  }`}
                >
                  {selectedValues.includes(option.value) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm text-white">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;
