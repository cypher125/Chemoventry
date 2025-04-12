"use client"

import * as React from "react"
import { CalendarIcon } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { addDays, format, subDays } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  onDateRangeChange: (dateRange: DateRange) => void;
  placeholderText?: string;
  className?: string;
}

export function DatePickerWithRange({ 
  onDateRangeChange, 
  placeholderText = "Select date range", 
  className 
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  React.useEffect(() => {
    if (date?.from && date?.to) {
      onDateRangeChange(date)
    }
  }, [date, onDateRangeChange])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:max-w-[350px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM dd, yyyy")} -{" "}
                  {format(date.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(date.from, "MMM dd, yyyy")
              )
            ) : (
              <span>{placeholderText}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
          <div className="p-3 border-b">
            <h3 className="font-medium text-center">Select Date Range</h3>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            className="rounded-md border"
          />
          <div className="flex items-center justify-end gap-2 py-2 px-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                setDate({
                  from: subDays(today, 7),
                  to: today,
                });
              }}
            >
              Last 7 Days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                setDate({
                  from: subDays(today, 30),
                  to: today,
                });
              }}
            >
              Last 30 Days
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

