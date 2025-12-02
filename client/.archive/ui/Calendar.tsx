import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      onChange,
      minDate,
      maxDate,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(
      value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date()
    );

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

    const daysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
    };

    const handleNextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
    };

    const handleDateClick = (day: number) => {
      if (disabled) return;

      const selectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      if (minDate && selectedDate < minDate) return;
      if (maxDate && selectedDate > maxDate) return;

      onChange?.(selectedDate);
    };

    const isDateDisabled = (day: number) => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;

      return false;
    };

    const isDateSelected = (day: number) => {
      if (!value) return false;

      return (
        value.getDate() === day &&
        value.getMonth() === currentMonth.getMonth() &&
        value.getFullYear() === currentMonth.getFullYear()
      );
    };

    const isToday = (day: number) => {
      const today = new Date();
      return (
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear()
      );
    };

    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const isSelected = isDateSelected(day);
      const isTodayDate = isToday(day);
      const isDisabled = disabled || isDateDisabled(day);

      days.push(
        <motion.button
          key={day}
          type="button"
          className={cn(
            'p-2 text-sm rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
            isTodayDate && !isSelected && 'border border-primary',
            isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
          )}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.1 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
        >
          {day}
        </motion.button>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border border-border bg-card',
          'w-fit',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className={cn(
              'p-2 rounded-md hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
            )}
            onClick={handlePrevMonth}
            disabled={disabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <h3 className="text-sm font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>

          <button
            type="button"
            className={cn(
              'p-2 rounded-md hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
            )}
            onClick={handleNextMonth}
            disabled={disabled}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="p-2 text-xs font-medium text-muted-foreground text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export { Calendar };
