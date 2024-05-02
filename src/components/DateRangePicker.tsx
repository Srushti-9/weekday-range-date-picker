// components/DateRangePicker.tsx

import { useState } from 'react';
import CalendarGrid from './CalendarGrid';

interface DateRangePickerProps {
  // Props definition
  onSelectRange: (startDate: Date, endDate: Date, weekends: Date[]) => void;
  predefinedRanges: { label: string; start: Date; end: Date }[];
}

function DateRangePicker({
  onSelectRange,
  predefinedRanges,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [displayedYear, setDisplayedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [displayedMonth, setDisplayedMonth] = useState<number>(
    new Date().getMonth()
  );
  // State to track the currently hovered date
  //const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Function to handle year change
  const handleYearChange = (year: number) => {
    setDisplayedYear(year);
  };

  // Function to handle month change
  const handleMonthChange = (month: number) => {
    setDisplayedMonth(month);
  };

  // Function to handle selection of a date
  const handleDateSelect = (selectedDate: Date) => {
    // Check if the selected date is a weekend (Saturday or Sunday)
    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
      // Do nothing if the selected date is a weekend
      return;
    }

    if (!startDate || endDate) {
      // Set the start date
      setStartDate(selectedDate);
      setEndDate(null); // Reset end date to allow selecting a new range
    } else if (!endDate && selectedDate > startDate) {
      // Set the end date if it's after the start date
      setEndDate(selectedDate);
      const weekends = getWeekends(startDate, selectedDate);
      // Call the onSelectRange callback with selected range and weekend dates
      onSelectRange(startDate, selectedDate, weekends);
    } else if (startDate > selectedDate) {
      setStartDate(selectedDate);
      setEndDate(startDate);

      const weekends = getWeekends(selectedDate, startDate);
      onSelectRange(selectedDate, startDate, weekends);
    } else {
      // Reset selection if the user clicks on an invalid date
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Find weekend dates within the selected range
  const getWeekends = (startDate: Date, selectedDate: Date): Date[] => {
    const weekends = [];
    const currentDate = new Date(startDate);

    while (currentDate <= selectedDate) {
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        weekends.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekends;
  };

  const getMonthName = (month: number): string => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month];
  };

  // Function to handle click on predefined range button
  const handlePredefinedRangeClick = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    // Call the onSelectRange callback with selected range and weekend dates
    const weekends = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        weekends.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    onSelectRange(start, end, weekends);
  };

  // Function to format date as "Month Day, Year" (e.g., "April 20, 2024")
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="container mx-auto max-w-md">
        <div>
          {/* Header with month, year, and navigation arrows */}
          <div className="flex justify-between items-center mb-4">
            {/* Container for previous year and month buttons */}
            <div className="flex items-center">
              {' '}
              {/* Flex container for previous year and month buttons */}
              {/* Left double arrow for previous year */}
              <button
                className="text-gray-500 font-semibold mr-2 px-2"
                onClick={() => handleYearChange(displayedYear - 1)}
              >
                {'<<'} {/* Double left arrow for previous year */}
              </button>
              {/* Left arrow for previous month */}
              <button
                className="text-gray-500 font-semibold mr-2 px-2"
                onClick={() => handleMonthChange(displayedMonth - 1)}
              >
                &lt;
              </button>
            </div>
            {/* Display month and year */}
            <div>{`${getMonthName(displayedMonth)}, ${displayedYear}`}</div>
            <div className="flex items-center">
              {/* Right arrow for next month */}
              <button
                className="text-gray-500 font-semibold mr-2 px-2"
                onClick={() => handleMonthChange(displayedMonth + 1)}
              >
                &gt;
              </button>
              {/* Right double arrow for next year */}
              <button
                className="px-2"
                onClick={() => handleYearChange(displayedYear + 1)}
              >
                {'>>'} {/* Double right arrow for next year */}
              </button>
            </div>
          </div>

          <CalendarGrid
            displayedYear={displayedYear}
            displayedMonth={displayedMonth}
            startDate={startDate}
            endDate={endDate}
            handleDateSelect={handleDateSelect}
          />
        </div>

        {/* Predefined ranges */}
        <div className="mt-4 flex items-center">
          <p className="font-semibold mr-3">Date Presets</p>
          <div className="flex flex-wrap gap-2">
            {predefinedRanges.map((range) => (
              <button
                key={range.label}
                className="bg-gray-200 px-3 py-1 rounded-md"
                onClick={() =>
                  handlePredefinedRangeClick(range.start, range.end)
                }
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        {/* Selected date range display */}
        {startDate && endDate && (
          <div className="mt-4 text-left">
            <span className="font-semibold">Selected Date Range:</span>{' '}
            {formatDate(startDate)} to {formatDate(endDate)}
          </div>
        )}
      </div>
    </>
  );
}

export default DateRangePicker;
