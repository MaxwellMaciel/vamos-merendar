
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

  // Map day names to abbreviated versions to avoid overlap
  const dayNameMapping = {
    'dom': 'D',
    'seg': 'S',
    'ter': 'T',
    'qua': 'Q',
    'qui': 'Q',
    'sex': 'S',
    'sáb': 'S',
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map((day) => (
          <div key={day.dayName} className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {/* Use abbreviated day names on mobile */}
            <span className="md:hidden">{dayNameMapping[day.dayName as keyof typeof dayNameMapping]}</span>
            <span className="hidden md:inline">{day.dayName}</span>
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
                ? 'bg-secondary text-white font-medium shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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
