import './App.css';
import DateRangePicker from './components/DateRangePicker';

function App() {
  // Dummy function to handle selection of date range
  const handleSelectRange = (
    startDate: Date,
    endDate: Date,
    weekends: Date[]
  ) => {
    console.log('Selected Date Range:', startDate, endDate);
    console.log('Weekend Dates:', weekends);
  };

  // Dummy predefined ranges
  const predefinedRanges = [
    {
      label: 'Last 7 days',
      start: new Date(2023, 2, 23),
      end: new Date(2023, 2, 29),
    },
    {
      label: 'Last 30 days',
      start: new Date(2023, 2, 1),
      end: new Date(2023, 2, 30),
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
