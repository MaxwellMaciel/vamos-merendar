import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DaySelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDate, onSelectDate }) => {
  // Get the start of the current week (Sunday)
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 0 });
  
  // Generate the days of the week
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(startOfCurrentWeek, index);
    return {
      date: day,
      dayNumber: format(day, 'd'),
      dayName: format(day, 'EEE', { locale: ptBR }).toLowerCase(),
      isSelected: format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
    };
  });

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map((day) => (
          <div key={day.dayName} className="text-xs font-medium text-gray-600">
            {day.dayName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => (
          <button
            key={day.date.toString()}
            onClick={() => onSelectDate(day.date)}
            className={`rounded-full w-9 h-9 mx-auto flex items-center justify-center transition-all ${
              day.isSelected
                ? 'bg-[#f45b43] text-white font-medium shadow-sm'
                : 'hover:bg-gray-100'
            }`}
          >
            {day.dayNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DaySelector;
