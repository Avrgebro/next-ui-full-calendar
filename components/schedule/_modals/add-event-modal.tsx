"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { useModalContext } from "@/providers/modal-provider";
import SelectDate from "@/components/schedule/_components/add-event-components/select-date";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormData, eventSchema, Variant, Event } from "@/types/index";
import { useScheduler } from "@/providers/scheduler-provider";
import { v4 as uuidv4 } from "uuid"; // Use UUID to generate event IDs
import { Label } from "@/components/ui/label";

export default function AddEventModal({
  CustomAddEventModal,
}: {
  CustomAddEventModal?: React.FC<{ register: any; errors: any }>;
}) {
  const { onClose, data } = useModalContext();

  const [selectedColor, setSelectedColor] = useState<string>(
    getEventColor(data?.variant || "primary")
  );

  const typedData = data as Event;

  const { handlers } = useScheduler();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      variant: data?.variant || "primary",
      color: data?.color || "blue",
    },
  });

  // Reset the form on initialization
  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        description: data.description || "",
        startDate: data.startDate,
        endDate: data.endDate,
        variant: data.variant || "primary",
        color: data.color || "blue",
      });
    }
  }, [data, reset]);

  const colorOptions = [
    { key: "blue", name: "Blue" },
    { key: "red", name: "Red" },
    { key: "green", name: "Green" },
    { key: "yellow", name: "Yellow" },
  ];

  function getEventColor(variant: Variant) {
    switch (variant) {
      case "primary":
        return "blue";
      case "danger":
        return "red";
      case "success":
        return "green";
      case "warning":
        return "yellow";
      default:
        return "blue";
    }
  }

  function getEventStatus(color: string) {
    switch (color) {
      case "blue":
        return "primary";
      case "red":
        return "danger";
      case "green":
        return "success";
      case "yellow":
        return "warning";
      default:
        return "default";
    }
  }

  const onSubmit: SubmitHandler<EventFormData> = (formData) => {
    const newEvent: Event = {
      id: uuidv4(), // Generate a unique ID
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      variant: formData.variant,
      description: formData.description,
    };

    if (!typedData?.id) handlers.handleAddEvent(newEvent);
    else handlers.handleUpdateEvent(newEvent, typedData.id);
    onClose(); // Close the modal after submission
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      {CustomAddEventModal ? (
        CustomAddEventModal({ register, errors })
      ) : (
        <>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Event Name</Label>
          <Input
            {...register("title")}
            placeholder="Enter event name"
          />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Enter event description"
            />
          </div>
          <SelectDate data={data} setValue={setValue} />

          <Select
            value={selectedColor}
            onValueChange={(value) => {
              setSelectedColor(value);
              reset((formData) => ({
                ...formData,
                variant: getEventStatus(value),
              }));
            }}
          >
            <SelectTrigger className="w-fit my-4">
              <SelectValue placeholder="Select color">
                {colorOptions.find((color) => color.key === selectedColor)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.key} value={color.key}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-${color.key}-500`} />
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save Event
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
