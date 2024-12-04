import axios from "axios";
import mockCalendarData from "../__mocks__/mockCalendarData.json";
import { CalendarResponse } from "../types/CalendarData";

// const API_URL = "<Your External URL>";
const API_URL = "https://localhost:3000/calendar";

export const fetchCalendarData = async (): Promise<CalendarResponse> => {
    if (process.env.NODE_ENV === "development") {
        console.log("Fetching mock data for development purposes.");
        return mockCalendarData as CalendarResponse;
    }

    try {
        const response = await axios.get<CalendarResponse>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching calendar data:", error);
        throw error;
    }
};
