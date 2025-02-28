"use client";

import { EventFormData } from "@/types";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";

export default function SelectDate({
  data,
  setValue,
}: {
  data?: { startDate: Date; endDate: Date };
  setValue: UseFormSetValue<EventFormData>;
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: data?.startDate || new Date(2024, 3, 6), // April 6, 2024
    to: data?.endDate || new Date(2024, 3, 10),    // April 10, 2024
  });

  const [timeState, setTimeState] = useState({
    startTime: {
      hour: data?.startDate?.getHours() || 0,
      minute: data?.startDate?.getMinutes() || 0
    },
    endTime: {
      hour: data?.endDate?.getHours() || 0,
      minute: data?.endDate?.getMinutes() || 0
    }
  });

  useEffect(() => {
    if (!dateRange?.from) return;

    const jsStartDate = new Date(dateRange.from);
    const jsEndDate = new Date(dateRange.to || dateRange.from);

    // add the time to the date
    jsStartDate.setHours(timeState.startTime.hour);
    jsStartDate.setMinutes(timeState.startTime.minute);

    jsEndDate.setHours(timeState.endTime.hour);
    jsEndDate.setMinutes(timeState.endTime.minute);

    // check if the end date is before the start date
    if (jsEndDate < jsStartDate) {
      jsEndDate.setHours(jsStartDate.getHours() + 1);
    }

    setValue("startDate", jsStartDate);
    setValue("endDate", jsEndDate);
  }, [dateRange, timeState, setValue]);

  return (
    <div>
      <div className="w-full flex gap-4 max-w-full flex-wrap">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* <TimeInput
            label="Start Time"
            defaultValue={{ hour: timeState.startTime.hour, minute: timeState.startTime.minute }}
            onChange={(time) => {
              setTimeState({
                ...timeState,
                startTime: time
              });
            }}
          />

          <TimeInput
            label="End Time"
            defaultValue={{ hour: timeState.endTime.hour, minute: timeState.endTime.minute }}
            onChange={(time) => {
              setTimeState({
                ...timeState,
                endTime: time
              });
            }}
            isInvalid={
              timeState.endTime.hour * 60 + timeState.endTime.minute <=
              timeState.startTime.hour * 60 + timeState.startTime.minute
            }
          /> */}
        </div>
      </div>
    </div>
  );
}
