import React from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Devotional } from '../types';

interface CalendarProps {
  devotionals: Devotional[];
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ devotionals, onSelectDate }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty placeholders for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const hasDevotional = (date: Date) => {
    const key = formatDateKey(date);
    return devotionals.some(d => d.date === key);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-stone-800 font-semibold">{monthName} <span className="text-stone-400">{year}</span></h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
          
          const dateKey = formatDateKey(date);
          const isToday = dateKey === new Date().toISOString().split('T')[0];
          const hasContent = hasDevotional(date);
          
          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`
                aspect-square rounded-full flex flex-col items-center justify-center relative transition-all duration-300
                ${isToday ? 'bg-rose-100 text-rose-800 font-bold ring-2 ring-rose-200' : 'hover:bg-stone-50 text-stone-700'}
                ${hasContent ? 'font-semibold' : 'opacity-70'}
              `}
            >
              <span className="text-sm">{date.getDate()}</span>
              {hasContent && (
                <div className="mt-1">
                  <Heart size={8} className="fill-rose-400 text-rose-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;