// components/DateRangePicker.tsx

import { useState } from 'react';

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
  // State to track the currently hovered date
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

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
    return (
      (startDate && date >= startDate && date <= endDate) ||
      (endDate && date >= endDate && date <= startDate)
    );
  };

  // Function to determine the class to apply to each date cell
  const getDateCellClass = (date: Date): string => {
    let classNames = 'p-2 text-center';
    if (startDate && endDate && date >= startDate && date <= endDate) {
      classNames += ' bg-blue-200';
    } else if (
      hoveredDate &&
      startDate &&
      date > startDate &&
      date <= hoveredDate
    ) {
      classNames += ' bg-blue-100';
    }
    return classNames;
  };

  return (
    <>
      {/* Header with month, year, and navigation arrows */}
      <div className="flex justify-between items-center mb-4">
        {/* Display month and year */}
        <div className="mr-2">{`${getMonthName(displayedMonth)}, ${displayedYear}`}</div>
        <div className="space-x-4 flex">
          <button
            className="text-gray-500 font-semibold mr-2"
            onClick={() => handleMonthChange(displayedMonth - 1)}
          >
            {' '}
            &lt;{' '}
          </button>
          <button
            className="text-gray-500 font-semibold"
            onClick={() => handleMonthChange(displayedMonth + 1)}
          >
            {' '}
            &gt;{' '}
          </button>
        </div>
      </div>
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
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Render each date in the calendar grid */}
          {monthDates.map((date) => (
            <div
              key={date.toISOString()}
              className={getDateCellClass(date)}
              onClick={() => handleDateSelect(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <span
                className={`${
                  getLocalDateString(date) === todayDateString
                    ? 'rounded-full border-2 border-blue-500 text-blue-500 p-2'
                    : ''
                }`}
              >
                {date.getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DateRangePicker;
