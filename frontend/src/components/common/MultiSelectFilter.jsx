import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";

const MultiSelectFilter = ({
  options,
  selectedValues = [],
  onChange,
  placeholder = "Select options",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        ref={buttonRef}
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between border-gray-600 text-gray-300 hover:bg-gray-700 min-h-[40px] relative z-10"
      >
        <div className="flex items-center flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 truncate">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedValues.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <span
                    key={value}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs max-w-[120px] truncate"
                  >
                    <span className="truncate">{option?.label}</span>
                    <X
                      className="h-3 w-3 ml-1 flex-shrink-0 cursor-pointer"
                      onClick={(e) => removeValue(value, e)}
                    />
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-[100] max-h-60 overflow-y-auto"
            style={{
              position: "absolute",
              top:
                buttonRef.current?.getBoundingClientRect().bottom +
                window.scrollY,
              left: buttonRef.current?.getBoundingClientRect().left,
              width: buttonRef.current?.offsetWidth,
            }}
          >
            <div className="p-2">
              {selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full text-left px-2 py-1 text-sm text-red-400 hover:bg-gray-700 rounded mb-1 transition-colors"
                >
                  Clear all
                </button>
              )}
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className="flex items-center px-2 py-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                >
                  <div
                    className={`w-4 h-4 border border-gray-500 rounded mr-2 flex items-center justify-center flex-shrink-0 ${
                      selectedValues.includes(option.value)
                        ? "bg-blue-500 border-blue-500"
                        : ""
                    }`}
                  >
                    {selectedValues.includes(option.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm text-white truncate">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MultiSelectFilter;
