import './App.css';
import DateRangePicker from './components/DateRangePicker';

function App() {
  // function to handle selection of date range
  const handleSelectRange = (
    startDate: Date,
    endDate: Date,
    weekends: Date[]
  ) => {
    console.log('Selected date range:', [
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
    ]);
    console.log(
      'Weekend dates within range:',
      weekends.map((date) => date.toISOString().split('T')[0])
    );
  };

  // Get today's date in the local timezone
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  const localToday = new Date(today.getTime() - timezoneOffset); // Adjust for timezone offset

  // Define predefined ranges array
  const predefinedRanges = [
    {
      label: 'Last 7 days',
      start: new Date(localToday.getTime() - 6 * 24 * 60 * 60 * 1000),
      end: localToday,
    },
    {
      label: 'Last 30 days',
      start: new Date(localToday.getTime() - 29 * 24 * 60 * 60 * 1000),
      end: localToday,
    },
    {
      label: 'Last 60 days',
      start: new Date(localToday.getTime() - 59 * 24 * 60 * 60 * 1000),
      end: localToday,
    },
  ];

  return (
    <>
      <div className="App">
        <h1 className="text-2xl font-bold mb-4">Weekday Date Range Picker</h1>
        <DateRangePicker
          onSelectRange={handleSelectRange}
          predefinedRanges={predefinedRanges}
        />
      </div>
    </>
  );
}

export default App;
