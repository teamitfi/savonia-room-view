import { UserAvailability } from "../types/CalendarData";

// const API_URL = "<Your External URL>";
const API_URL =
  "https://classroomview-func.azurewebsites.net/api/getCalendarData?code=uqs8Zf76n5EcLAQ4qosrD2WJ5NOPxEMf-WGZo2U3LPoCAzFuEbIsVQ%3D%3D";

export const fetchCalendarData = async (): Promise<{
  success: boolean;
  data: UserAvailability[];
}> => {
  const response = await fetch(API_URL);
  return response.json();
};
