// components/DateRangePicker.tsx

import React, { useState } from 'react';

interface DateRangePickerProps {
  // Props definition
  onSelectRange: (startDate: Date, endDate: Date, weekends: Date[]) => void;
  //predefinedRanges: { label: string; start: Date; end: Date }[];
}

function DateRangePicker({
  onSelectRange,
  //predefinedRanges,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [displayedYear, setDisplayedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [displayedMonth, setDisplayedMonth] = useState<number>(
    new Date().getMonth()
  );

  // Function to generate an array of dates for the displayed month
  const generateMonthDates = (year: number, month: number): Date[] => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const dates: Date[] = [];

    // Start from the first day of the week (Sunday) before the first day of the month
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(startDay.getDate() - startDay.getDay());

    // Loop through each day in the grid
    while (startDay <= lastDayOfMonth) {
      dates.push(new Date(startDay));
      startDay.setDate(startDay.getDate() + 1);
    }

    return dates;
  };

  // Function to handle year change
  const handleYearChange = (year: number) => {
    setDisplayedYear(year);
  };

  // Function to handle month change
  const handleMonthChange = (month: number) => {
    setDisplayedMonth(month);
  };

  // Generate dates for the displayed month
  const monthDates = generateMonthDates(displayedYear, displayedMonth);

  // Function to handle selection of a date
  const handleDateSelect = (selectedDate: Date) => {
    if (!startDate) {
      // Set the start date
      setStartDate(selectedDate);
    } else if (!endDate && selectedDate > startDate) {
      // Set the end date if it's after the start date
      setEndDate(selectedDate);
      // Find weekend dates within the selected range
      const weekends = [];
      const currentDate = new Date(startDate);
      while (currentDate <= selectedDate) {
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          weekends.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // Call the onSelectRange callback with selected range and weekend dates
      onSelectRange(startDate, selectedDate, weekends);
    } else {
      // Reset selection if the user clicks on an invalid date
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <div className="container mx-auto">
      {/* Buttons for year navigation */}
      <div className="flex justify-center mb-4">
        <button
          className="mr-2"
          onClick={() => handleYearChange(displayedYear - 1)}
        >
          Previous Year
        </button>
        <button onClick={() => handleYearChange(displayedYear + 1)}>
          Next Year
        </button>
      </div>
      {/* Buttons for month navigation */}
      <div className="flex justify-center mb-4">
        <button
          className="mr-2"
          onClick={() => handleMonthChange(displayedMonth - 1)}
        >
          Previous Month
        </button>
        <button onClick={() => handleMonthChange(displayedMonth + 1)}>
          Next Month
        </button>
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Render each date in the calendar grid */}
        {monthDates.map((date) => (
          <div
            key={date.toISOString()}
            className={`p-2 text-center ${
              date.getMonth() === displayedMonth
                ? 'bg-gray-200 cursor-pointer'
                : 'bg-gray-300'
            }${
              // Apply different style to selected dates
              startDate && endDate && date >= startDate && date <= endDate
                ? 'bg-blue-500 text-white'
                : ''
            }
            `}
            onClick={() => handleDateSelect(date)}
          >
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DateRangePicker;
