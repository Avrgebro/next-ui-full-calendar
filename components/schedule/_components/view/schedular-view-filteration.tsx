"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

import AddEventModal from "../../_modals/add-event-modal";
import DailyView from "./day/daily-view";
import MonthView from "./month/month-view";
import WeeklyView from "./week/week-view";
import { useModalContext } from "@/providers/modal-provider";
import { ClassNames, CustomComponents, Views } from "@/types/index";

// Animation settings for Framer Motion
const animationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, type: "spring", stiffness: 250 },
};

export default function SchedulerViewFilteration({
  views = {
    views: ["day", "week", "month"],
    mobileViews: ["day"],
  },
  CustomComponents,

  classNames,
}: {
  views?: Views;
  CustomComponents?: CustomComponents;

  classNames?: ClassNames;
}) {
  const { showModal: showAddEventModal } = useModalContext();

  const [clientSide, setClientSide] = React.useState(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const [isMobile, setIsMobile] = React.useState(
    clientSide ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (!clientSide) return;
    setIsMobile(window.innerWidth <= 768);
    function handleResize() {
      if (window && window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window && window.addEventListener("resize", handleResize);

    return () => window && window.removeEventListener("resize", handleResize);
  }, [clientSide]);

  function handleAddEvent(selectedDay?: number) {
    showAddEventModal({
      title:
        CustomComponents?.CustomEventModal?.CustomAddEventModal?.title ||
        "Add Event",
      body: (
        <AddEventModal
          CustomAddEventModal={
            CustomComponents?.CustomEventModal?.CustomAddEventModal?.CustomForm
          }
        />
      ),
      getter: async () => {
        const startDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          selectedDay ?? // current day
            new Date().getDate(),
          0,
          0,
          0,
          0
        );
        const endDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          selectedDay ?? // current day
            new Date().getDate(),
          23,
          59,
          59,
          999
        );
        return { startDate, endDate };
      },
    });
  }

  const viewsSelector = isMobile ? views?.mobileViews : views?.views;
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <div className="dayly-weekly-monthly-selection relative w-full">
          <Tabs
            className={classNames?.tabs?.wrapper}
            aria-label="Options"
            defaultValue="day"
          >
            <TabsList>
              {viewsSelector?.includes("day") && (
                <TabsTrigger value="day">
                  <span>Day</span>
                </TabsTrigger>
              )}
              {viewsSelector?.includes("week") && (
                <TabsTrigger value="week">
                  <span>Week</span>
                </TabsTrigger>
              )}
              {viewsSelector?.includes("month") && (
                <TabsTrigger value="month">
                  <span>Month</span>
                </TabsTrigger>
              )}
            </TabsList>
            {viewsSelector?.includes("day") && (
              <TabsContent value="day">
                <motion.div {...animationConfig}>
                  <DailyView
                    classNames={classNames?.buttons}
                    prevButton={
                      CustomComponents?.customButtons?.CustomPrevButton
                    }
                    nextButton={
                      CustomComponents?.customButtons?.CustomNextButton
                    }
                    CustomEventComponent={
                      CustomComponents?.CustomEventComponent
                    }
                    CustomEventModal={CustomComponents?.CustomEventModal}
                  />
                </motion.div>
              </TabsContent>
            )}
            {viewsSelector?.includes("week") && (
              <TabsContent value="week">
                <motion.div {...animationConfig}>
                  <WeeklyView
                    classNames={classNames?.buttons}
                    prevButton={
                      CustomComponents?.customButtons?.CustomPrevButton
                    }
                    nextButton={
                      CustomComponents?.customButtons?.CustomNextButton
                    }
                    CustomEventComponent={
                      CustomComponents?.CustomEventComponent
                    }
                    CustomEventModal={CustomComponents?.CustomEventModal}
                  />
                </motion.div>
              </TabsContent>
            )}
            {viewsSelector?.includes("month") && (
              <TabsContent value="month">
                <motion.div {...animationConfig}>
                  <MonthView
                    classNames={classNames?.buttons}
                    prevButton={
                      CustomComponents?.customButtons?.CustomPrevButton
                    }
                    nextButton={
                      CustomComponents?.customButtons?.CustomNextButton
                    }
                    CustomEventComponent={
                      CustomComponents?.CustomEventComponent
                    }
                    CustomEventModal={CustomComponents?.CustomEventModal}
                  />
                </motion.div>
              </TabsContent>
            )}
          </Tabs>

          {
            // Add custom button
            CustomComponents?.customButtons?.CustomAddEventButton ? (
              <div
                onClick={() => handleAddEvent()}
                className="absolute top-0 right-0"
              >
                {CustomComponents?.customButtons.CustomAddEventButton}
              </div>
            ) : (
              <Button
                onClick={() => handleAddEvent()}
                className={
                  "absolute top-0 right-0 " + classNames?.buttons?.addEvent
                }
                color="primary"
              >
                <Calendar />Add Event
              </Button>
            )
          }
        </div>
      </div>
    </div>
  );
}
