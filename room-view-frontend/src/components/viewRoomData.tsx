import React, { useEffect, useState } from "react";
import { fetchRoomData } from "../services/roomViewService";

interface RoomEvent {
    date: string;
    event: string;
}

const Calendar: React.FC = () => {
    const [events, setEvents] = useState<RoomEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchRoomData();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching calendar data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    return (
        <div>
            <h1>Calendar Events</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {events.map((event, index) => (
                        <li key={index}>
                            <strong>{event.date}:</strong> {event.event}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Calendar;
