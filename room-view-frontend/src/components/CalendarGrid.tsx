import React, { useEffect, useState } from "react";
import { fetchCalendarData } from "../services/calendarService";
import { Schedule, ScheduleInformation, ScheduleItem } from "../types/CalendarData";
import WeeklyGrid from "./WeeklyGrid";

const CalendarGrid: React.FC = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleInformation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCalendarData();
                setScheduleData(data.value);
            } catch (error) {
                console.error("Error fetching calendar data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {WeeklyGrid({ grid: generateWeeklyGridArray(scheduleData) })}
                </div>
            )}
        </div>
    )
};

export default CalendarGrid;

export const generateWeeklyGridArray = (CalendarData: ScheduleInformation[]) => {
    const scheduleData = CalendarData.flatMap(info => info.scheduleItems) as ScheduleItem[];
    const workingHours = { start: 7, end: 17 };
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const grid: { [day: string]: Schedule } = {};
    daysOfWeek.forEach((day) => {
        grid[day] = {};
        for (let hour = workingHours.start; hour < workingHours.end; hour++) {
            grid[day][`${hour}:00`] = "Free";
        }
    });

    // Fill the grid based on schedule data
    scheduleData.forEach((item) => {
        const startDateTime = new Date(item.start.dateTime);
        const endDateTime = new Date(item.end.dateTime);

        const day = startDateTime.toLocaleString("en-US", { weekday: "long" });
        const startHour = startDateTime.getHours();
        const endHour = endDateTime.getHours();

        if (daysOfWeek.includes(day)) {
            for (let hour = startHour; hour < endHour; hour++) {
                grid[day][`${hour}:00`] = item.status;
            }
        }
    });

    return grid;
};
