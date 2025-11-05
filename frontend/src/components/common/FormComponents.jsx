import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Reusable Date Input Component with Custom Calendar
export const FormDate = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Select date",
  error,
  className = "",
  required = false,
  disabled = false,
  min,
  max,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [manualInput, setManualInput] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  const manualInputRef = useRef(null);

  const inputStyles =
    "h-12 bg-[#1A1A1A] border-2 border-[#343434] text-white placeholder:text-[#B0AFAF] rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  // Initialize current month/year from selected date
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
      setManualInput(formatDateForDisplay(selectedDate));
    }
  }, [selectedDate]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        manualInputRef.current &&
        !manualInputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsManualMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus manual input when switching to manual mode
  useEffect(() => {
    if (isManualMode && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [isManualMode]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(date);
    setManualInput(formatDateForDisplay(date));
    setIsOpen(false);
    setIsManualMode(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const parseManualInput = (input) => {
    // Try different date formats
    const formats = [
      // MM/DD/YYYY
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      // YYYY-MM-DD
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      // MM-DD-YYYY
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      // Month DD, YYYY
      /^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/,
    ];

    for (const format of formats) {
      const match = input.match(format);
      if (match) {
        let year, month, day;

        if (format === formats[0] || format === formats[2]) {
          // MM/DD/YYYY or MM-DD-YYYY
          month = parseInt(match[1]) - 1;
          day = parseInt(match[2]);
          year = parseInt(match[3]);
        } else if (format === formats[1]) {
          // YYYY-MM-DD
          year = parseInt(match[1]);
          month = parseInt(match[2]) - 1;
          day = parseInt(match[3]);
        } else if (format === formats[3]) {
          // Month DD, YYYY
          const monthNames = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
          ];
          const monthName = match[1].toLowerCase();
          month = monthNames.findIndex((m) => monthName.startsWith(m));
          day = parseInt(match[2]);
          year = parseInt(match[3]);
        }

        if (
          month >= 0 &&
          month <= 11 &&
          day >= 1 &&
          day <= 31 &&
          year >= 1900 &&
          year <= 2100
        ) {
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split("T")[0];
          }
        }
      }
    }
    return null;
  };

  const handleManualInputChange = (e) => {
    const value = e.target.value;
    setManualInput(value);

    // Auto-parse when input seems complete
    if (value.length > 6) {
      const parsedDate = parseManualInput(value);
      if (parsedDate) {
        setSelectedDate(parsedDate);
        onChange(parsedDate);
        setIsOpen(false);
      }
    }
  };

  const handleManualInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const parsedDate = parseManualInput(manualInput);
      if (parsedDate) {
        handleDateSelect(parsedDate);
      } else {
        // Invalid date, revert to previous value
        setManualInput(selectedDate ? formatDateForDisplay(selectedDate) : "");
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsManualMode(false);
      setManualInput(selectedDate ? formatDateForDisplay(selectedDate) : "");
    }
  };

  const handleManualInputBlur = () => {
    if (manualInput) {
      const parsedDate = parseManualInput(manualInput);
      if (parsedDate) {
        handleDateSelect(parsedDate);
      } else {
        // Invalid date, revert to previous value
        setManualInput(selectedDate ? formatDateForDisplay(selectedDate) : "");
      }
    }
    setIsManualMode(false);
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isDisabled: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected =
        selectedDate &&
        date.toDateString() === new Date(selectedDate).toDateString();

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
      });
    }

    // Next month days
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - days.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, day),
        isCurrentMonth: false,
        isDisabled: true,
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const navigateYear = (direction) => {
    setCurrentYear(currentYear + direction);
  };

  const calendarDays = getCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fix duplicate keys by using unique identifiers for week days
  const weekDays = [
    { key: "sun", label: "S" },
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" },
  ];

  return (
    <div className="space-y-2 relative">
      {label && (
        <Label htmlFor={id} className="text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        {/* Original Calendar Icon - Same size and color as other icons */}
        <div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B0AFAF] cursor-pointer hover:text-primary transition-colors z-20"
          onClick={handleInputClick}
        >
          <Calendar className="h-4 w-4" />
        </div>

        {/* Hidden Native Input for form submission */}
        <input
          type="date"
          id={id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 pointer-events-none"
          required={required}
          disabled={disabled}
          min={min}
          max={max}
        />

        {/* Manual Input Field */}
        {isManualMode ? (
          <div ref={manualInputRef} className="relative">
            <Input
              type="text"
              value={manualInput}
              onChange={handleManualInputChange}
              onKeyDown={handleManualInputKeyDown}
              onBlur={handleManualInputBlur}
              className={`${inputStyles} pl-10 pr-4 ${
                error ? "border-red-500" : ""
              } ${className}`}
              placeholder="e.g. 12/25/2023 or Dec 25, 2023"
              autoFocus
            />
          </div>
        ) : (
          /* Custom Styled Display Input */
          <div
            ref={inputRef}
            onClick={handleInputClick}
            onDoubleClick={() => !disabled && setIsManualMode(true)}
            className={`${inputStyles} pl-10 pr-4 cursor-pointer flex items-center ${
              error ? "border-red-500" : ""
            } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className={selectedDate ? "text-white" : "text-[#B0AFAF]"}>
              {selectedDate ? formatDateForDisplay(selectedDate) : placeholder}
            </span>
          </div>
        )}
      </div>

      {/* Custom Calendar Dropdown - Fixed Layout (no position shift) */}
      {isOpen && !disabled && (
        <div
          ref={calendarRef}
          className="absolute top-full left-0 z-50 bg-[#262626] border-2 border-[#343434] rounded-xl shadow-2xl p-3 w-64 backdrop-blur-sm"
          style={{ marginTop: "2px" }} // Fixed: No layout shift
        >
          {/* Calendar Header with Year Navigation */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateYear(-1)}
                className="h-6 w-6 p-0 text-[#B0AFAF] hover:text-primary hover:bg-primary/10 rounded text-xs"
                title="Previous year"
              >
                «
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="h-6 w-6 p-0 text-[#B0AFAF] hover:text-primary hover:bg-primary/10 rounded text-xs"
                title="Previous month"
              >
                ‹
              </Button>
            </div>

            <div className="text-white font-semibold text-sm px-2 text-center min-w-[120px]">
              {monthNames[currentMonth]} {currentYear}
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="h-6 w-6 p-0 text-[#B0AFAF] hover:text-primary hover:bg-primary/10 rounded text-xs"
                title="Next month"
              >
                ›
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateYear(1)}
                className="h-6 w-6 p-0 text-[#B0AFAF] hover:text-primary hover:bg-primary/10 rounded text-xs"
                title="Next year"
              >
                »
              </Button>
            </div>
          </div>

          {/* Week Days Header - Fixed duplicate keys */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {weekDays.map((day) => (
              <div
                key={day.key}
                className="text-center text-[#B0AFAF] text-xs font-medium py-1"
              >
                {day.label}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">
            {calendarDays.map((day, index) => (
              <button
                key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}-${index}`}
                onClick={() =>
                  !day.isDisabled &&
                  handleDateSelect(day.date.toISOString().split("T")[0])
                }
                disabled={day.isDisabled}
                className={`
                  h-7 w-7 text-xs font-medium transition-all duration-200 mx-auto
                  ${
                    day.isSelected
                      ? "bg-primary text-[#0F0F0E] font-bold rounded-full scale-110"
                      : day.isToday
                      ? "bg-primary/20 text-primary border border-primary/30 rounded-full"
                      : day.isCurrentMonth
                      ? "text-white hover:bg-primary/30 hover:text-white rounded-full"
                      : "text-[#666] cursor-not-allowed"
                  }
                  ${day.isDisabled ? "opacity-30 cursor-not-allowed" : ""}
                  flex items-center justify-center
                `}
                title={day.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between mt-3 pt-3 border-t border-[#343434]">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const todayString = today.toISOString().split("T")[0];
                  setCurrentMonth(today.getMonth());
                  setCurrentYear(today.getFullYear());
                  handleDateSelect(todayString);
                }}
                className="text-xs text-[#B0AFAF] hover:text-primary hover:bg-primary/10 h-6 px-2"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => !disabled && setIsManualMode(true)}
                className="text-xs text-[#B0AFAF] hover:text-primary hover:bg-primary/10 h-6 px-2"
                title="Double-click input field or click here to type date manually"
              >
                Type
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDate("");
                onChange("");
                setManualInput("");
                setIsOpen(false);
                // Reset to current month/year when clearing
                const today = new Date();
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}
              className="text-xs text-[#B0AFAF] hover:text-red-400 hover:bg-red-400/10 h-6 px-2"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Help text for manual input */}
      {!isManualMode && !disabled && (
        <p className="text-[#B0AFAF] text-xs">
          Double-click to type date manually • Supports formats: 12/25/2023,
          2023-12-25, Dec 25 2023
        </p>
      )}
    </div>
  );
};

// Reusable Input Component (existing - keep as is)
export const FormInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  className = "",
  min,
  max,
  required = false,
  disabled = false,
  ...props
}) => {
  const inputStyles =
    "h-12 bg-[#1A1A1A] border-2 border-[#343434] text-white placeholder:text-[#B0AFAF] rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B0AFAF]" />
        )}
        <Input
          id={id}
          type={type}
          value={value || ""}
          onChange={onChange}
          className={`${inputStyles} ${Icon ? "pl-10" : ""} ${
            error ? "border-red-500" : ""
          } ${className}`}
          placeholder={placeholder}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

// Reusable Select Component (existing - keep as is)
export const FormSelect = ({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  options,
  icon: Icon,
  error,
  className = "",
  required = false,
  disabled = false,
}) => {
  const selectTriggerStyles =
    "h-12 bg-[#1A1A1A] border-2 border-[#343434] text-white rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B0AFAF] z-10" />
        )}
        <Select
          value={value || ""}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={`${selectTriggerStyles} ${
              Icon ? "pl-10" : ""
            } ${className}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-[#262626] border-[#343434] text-white">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

// Reusable Textarea Component (existing - keep as is)
export const FormTextarea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  className = "",
  required = false,
  disabled = false,
  rows = 4,
}) => {
  const textareaStyles =
    "bg-[#1A1A1A] border-2 border-[#343434] text-white placeholder:text-[#B0AFAF] rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={id}
        value={value || ""}
        onChange={onChange}
        className={`${textareaStyles} ${
          error ? "border-red-500" : ""
        } ${className}`}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

// Form Group Component for layout (existing - keep as is)
export const FormGroup = ({ children, className = "" }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

// Form Section Component (existing - keep as is)
export const FormSection = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        {description && <p className="text-[#B0AFAF] text-sm">{description}</p>}
      </div>
      {children}
    </div>
  );
};
