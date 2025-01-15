import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "./WeeklyGrid.css";
import { CalendarEvent, UserAvailability } from "../types/CalendarData";
import { fetchCalendarData } from "../services/calendarService";

dayjs.extend(isSameOrAfter);
const generateTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  let current = dayjs(start);
  const endTime = dayjs(end);

  while (current.isBefore(endTime)) {
    slots.push(current.format("HH:mm"));
    current = current.add(60, "minute");
  }

  return slots;
};

const formatEmail = (email: string): string => {
  const extracted = email.split("-")[1].split("@")[0];
  const capitalized = extracted.charAt(0).toUpperCase() + extracted.slice(1);
  return capitalized;
};

const CalendarGrid: React.FC = () => {
  const [data, setData] = useState<UserAvailability[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchCalendarData();
        if (result.success) {
          setData(result.data);
        } else {
          setError("Failed to fetch calendar data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available.</p>;

  const timeSlots = generateTimeSlots(
    "2025-01-15T07:00:00",
    "2025-01-15T22:00:00"
  );

  const isBusy = (timeSlot: string, userEvents: CalendarEvent[]): boolean => {
    const today = dayjs();
    console.log("Time:", timeSlot);
    // Parse timeSlot and set it to today's date
    const time = dayjs()
      .set("hour", parseInt(timeSlot.split(":")[0]))
      .set("minute", parseInt(timeSlot.split(":")[1]))
      .set("second", 0)
      .set("millisecond", 0);

    const todayEvents = userEvents.filter(
      (event) => dayjs(event.StartTime).isSame(today, "day") // Check if the event date is the same as today
    );

    return todayEvents.some((event) => {
      const eventStart = dayjs(event.StartTime); // Parse the event start time
      const eventEnd = dayjs(event.EndTime); // Parse the event end time
      console.log("Time Slot 1:", time);
      console.log("Time Slot:", time.format("HH:mm"));
      console.log("Event Start:", eventStart.format("HH:mm"));
      console.log("Event End:", eventEnd.format("HH:mm"));
      console.log("Busy Type:", event.BusyType);
      // Check if the time falls within the event duration
      return (
        event.BusyType === "Busy" &&
        time.isSameOrAfter(eventStart, "minute") &&
        time.isBefore(eventEnd, "minute")
      );
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Calendar Availability</h1>
      <table border={1} className="weekly-grid-table">
        <thead>
          <tr>
            <th>Time</th>
            {data.map((user: any) => (
              <th key={user.userEmail}>{formatEmail(user.userEmail)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, index) => (
            <tr key={index + "." + slot}>
              <td>{slot}</td>
              {data.map((user) => {
                const busy = isBusy(slot, user.userEvent);
                return (
                  <td
                    key={user.userEmail}
                    className={busy ? "busy-cell" : "free-cell"}
                  >
                    {busy ? "Busy" : "Free"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarGrid;
