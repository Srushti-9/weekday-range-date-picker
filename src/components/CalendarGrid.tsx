// components/CalendarGrid.tsx

interface CalendarGridProps {
  displayedYear: number;
  displayedMonth: number;
  startDate: Date | null;
  endDate: Date | null;
  handleDateSelect: (selectedDate: Date) => void;
}

function CalendarGrid({
  displayedYear,
  displayedMonth,
  startDate,
  endDate,
  handleDateSelect,
}: CalendarGridProps) {
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

  // Generate dates for the displayed month
  const monthDates = generateMonthDates(displayedYear, displayedMonth);

  // Function to generate an array of weekdays
  const generateWeekdays = (): string[] => {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Initials for each day of the week
    return weekdays;
  };

  // Generate weekdays array
  const weekdays = generateWeekdays();

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

  const getDateClasses = (date: Date): string => {
    let classes = 'inline-block p-1 w-10 h-10';

    if (getLocalDateString(date) === todayDateString) {
      classes += ' rounded-full border-2 border-blue-500 text-blue-500 p-2';
    }

    if (startDate && startDate.toDateString() === date.toDateString()) {
      classes += ' bg-blue-500 text-white rounded-full';
    }

    if (endDate && endDate.toDateString() === date.toDateString()) {
      classes += ' bg-blue-500 text-white rounded-full';
    }

    if (
      isInSelectedRange(date) &&
      date !== startDate &&
      date !== endDate &&
      date.getDay() !== 0 &&
      date.getDay() !== 6
    ) {
      classes +=
        ' rounded-full border-2 border-blue-500 text-blue-500 bg-blue-200';
    }

    if (date.getDay() === 0 || date.getDay() === 6) {
      classes += ' text-gray-400';
    }

    return classes;
  };

  return (
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
          >
            <span className={getDateClasses(date)}>{date.getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarGrid;
