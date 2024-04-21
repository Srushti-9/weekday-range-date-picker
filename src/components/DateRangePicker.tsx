// components/DateRangePicker.tsx

import { useState } from 'react';

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

  // Function to get the local date string
  const getLocalDateString = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Get today's date
  const today = new Date();
  const todayDateString = getLocalDateString(today);

  // Function to determine if a date is within the selected range
  const isInSelectedRange = (date: Date): boolean => {
    if (startDate && endDate) {
      return (
        (date >= startDate && date <= endDate) ||
        (date >= endDate && date <= startDate)
      );
    } else {
      return false;
    }
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

  // Function to generate an array of weekdays
  const generateWeekdays = (): string[] => {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Initials for each day of the week
    // Get the starting day of the week (0 for Sunday, 1 for Monday)
    const startingDay = new Date().getDay();
    // Rotate the weekdays array to match the starting day of the week
    return [...weekdays.slice(startingDay), ...weekdays.slice(0, startingDay)];
  };

  // Generate weekdays array
  const weekdays = generateWeekdays();

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
          <div className="container mx-auto">
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Render each date in the calendar grid */}
              {weekdays.map((day, index) => (
                <div
                  key={index}
                  className="p-2 text-center text-sm font-light text-gray-500"
                >
                  {day}
                </div>
              ))}
              {monthDates.map((date) => (
                <div
                  key={date.toISOString()}
                  className={`text-center cursor-pointer ${
                    date.getDay() === 0 || date.getDay() === 6
                      ? 'cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => handleDateSelect(date)}
                  //onMouseEnter={() => setHoveredDate(date)}
                  //onMouseLeave={() => setHoveredDate(null)}
                >
                  <span
                    className={`inline-block p-1 w-10 h-10 ${
                      getLocalDateString(date) === todayDateString
                        ? 'rounded-full border-2 border-blue-500 text-blue-500 p-2'
                        : ''
                    }${
                      startDate &&
                      startDate.toDateString() === date.toDateString()
                        ? ' bg-blue-500 text-white rounded-full'
                        : ''
                    }
                ${
                  endDate && endDate.toDateString() === date.toDateString()
                    ? ' bg-blue-500 text-white rounded-full'
                    : ''
                }
                ${
                  isInSelectedRange(date) &&
                  date !== startDate &&
                  date !== endDate &&
                  date.getDay() !== 0 && // Exclude Sundays
                  date.getDay() !== 6 // Exclude Saturdays
                    ? 'rounded-full border-2 border-blue-500 text-blue-500 bg-blue-200'
                    : ''
                }${
                  date.getDay() === 0 || date.getDay() === 6
                    ? 'text-gray-400'
                    : ''
                }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
