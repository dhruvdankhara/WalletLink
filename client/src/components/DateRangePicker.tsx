/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  startOfToday,
  endOfToday,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from 'date-fns';
import { useState } from 'react';

type DateRange = {
  from: Date;
  to: Date;
};

export default function DateRangePicker({
  onChange,
}: {
  onChange: (range: DateRange) => void;
}) {
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const applyPreset = (range: DateRange) => {
    setDate(range);
    onChange(range);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left">
          <CalendarIcon className="mr-0 h-4 w-4" />
          {format(date.from, 'dd  MMM, yyyy')} →{' '}
          {format(date.to, 'dd  MMM,  yyyy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1" align="start">
        <Calendar
          mode="range"
          selected={{ from: date.from, to: date.to }}
          onSelect={(range: any) => {
            if (range?.from && range?.to) {
              setDate(range);
              onChange?.(range);
            }
          }}
          numberOfMonths={2}
        />

        {/* Filters */}
        <p className="mb-2 px-2 text-sm font-medium text-gray-700">
          Range Presets
        </p>
        <div className="mt-1 grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={() =>
              applyPreset({
                from: startOfToday(),
                to: endOfToday(),
              })
            }
          >
            Today
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              applyPreset({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date()),
              })
            }
          >
            This Month
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              applyPreset({
                from: startOfMonth(subMonths(new Date(), 1)),
                to: endOfMonth(subMonths(new Date(), 1)),
              })
            }
          >
            Last Month
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              applyPreset({
                from: startOfYear(new Date()),
                to: endOfYear(new Date()),
              })
            }
          >
            This Year
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
