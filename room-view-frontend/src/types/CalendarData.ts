export interface CalendarEvent {
  StartTime: string;
  EndTime: string;
  BusyType: string;
}

export interface UserAvailability {
  userEmail: string;
  userEvent: CalendarEvent[];
}

export interface AvailabilityData {
  success: boolean;
  data: UserAvailability[];
}
