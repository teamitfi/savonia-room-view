import axios from "axios";
import { fetchCalendarData } from "./calendarService";
import mockCalendarData from "../__mocks__/mockCalendarData.json";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchCalendarData", () => {
    it("should fetch calendar data successfully", async () => {
        mockedAxios.get.mockResolvedValue({ data: mockCalendarData });

        const result = await fetchCalendarData();

        expect(result).toEqual(mockCalendarData);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith("<Your External URL>");
    });

    it("should handle errors gracefully", async () => {
        mockedAxios.get.mockRejectedValue(new Error("Network error"));

        await expect(fetchCalendarData()).rejects.toThrow("Network error");
    });
});
