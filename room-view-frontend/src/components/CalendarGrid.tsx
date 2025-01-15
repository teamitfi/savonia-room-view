import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "./WeeklyGrid.css";
import { CalendarEvent, UserAvailability } from "../types/CalendarData";
import { fetchCalendarData } from "../services/calendarService";

dayjs.extend(isSameOrAfter);

const COLUMNS_PER_PAGE = 10; // Adjust the number of user columns per page
const DAY_START_HOUR = 7;
const DAY_END_HOUR = 18;

const generateTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  let current = dayjs(start);
  const endTime = dayjs(end);

  while (current.isBefore(endTime)) {
    slots.push(current.format("HH:mm"));
    current = current.add(30, "minute");
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

  // Pagination state for columns
  const [currentPage, setCurrentPage] = useState(1);

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

  // Set up automatic pagination every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        const totalColumns = data?.length || 0;
        const totalPages = Math.ceil(totalColumns / COLUMNS_PER_PAGE);
        const nextPage = prevPage === totalPages ? 1 : prevPage + 1;
        return nextPage;
      });
    }, 30000); // Change page every 30 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available.</p>;

  // Generate the start and end times for today
  const startOfDay = dayjs()
    .startOf("day")
    .set("hour", DAY_START_HOUR)
    .set("minute", 0)
    .set("second", 0);
  const endOfDay = dayjs()
    .startOf("day")
    .set("hour", DAY_END_HOUR)
    .set("minute", 0)
    .set("second", 0);

  // Generate time slots using the dynamic start and end times
  const timeSlots = generateTimeSlots(
    startOfDay.toISOString(),
    endOfDay.toISOString()
  );

  const isBusy = (timeSlot: string, userEvents: CalendarEvent[]): boolean => {
    const today = dayjs();
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

      // Check if the time falls within the event duration
      return (
        event.BusyType === "Busy" &&
        time.isSameOrAfter(eventStart, "minute") &&
        time.isBefore(eventEnd, "minute")
      );
    });
  };

  // Get the user columns for the current page
  const indexOfLastColumn = currentPage * COLUMNS_PER_PAGE;
  const indexOfFirstColumn = indexOfLastColumn - COLUMNS_PER_PAGE;
  const currentColumns = data.slice(indexOfFirstColumn, indexOfLastColumn);

  // Generate page numbers for columns
  const totalColumns = data.length;
  const totalPages = Math.ceil(totalColumns / COLUMNS_PER_PAGE);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="classrooms-grid-container">
      <h1>Calendar Availability</h1>
      <table border={1} className="weekly-grid-table">
        <thead className="classroom-grid-header">
          <tr>
            <th>Time</th>
            {currentColumns.map((user: any) => (
              <th key={user.userEmail}>{formatEmail(user.userEmail)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, index) => (
            <tr key={index + "." + slot}>
              <td className="classroom-grid-timeslot">{slot}</td>
              {currentColumns.map((user) => {
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

      {/* Pagination Controls for Columns */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            className={`pagination-button ${
              currentPage === number ? "active" : ""
            }`}
            key={number}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CalendarGrid;
