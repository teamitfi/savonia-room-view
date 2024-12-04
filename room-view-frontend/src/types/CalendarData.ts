export interface ScheduleItem {
    status: "Busy" | "Tentative";
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
}

export interface Schedule {
    [key: string]: string; // Keyed by time slot, value is status ("Free", "Busy", "Tentative")
}

export interface WorkingHours {
    daysOfWeek: string[];
    startTime: string;
    endTime: string;
    timeZone: {
        "@odata.type": string;
        bias: number;
        name: string;
        standardOffset: {
            time: string;
            dayOccurrence: number;
            dayOfWeek: string;
            month: number;
            year: number;
        };
        daylightOffset: {
            daylightBias: number;
            time: string;
            dayOccurrence: number;
            dayOfWeek: string;
            month: number;
            year: number;
        };
    };
}

export interface ScheduleInformation {
    scheduleId: string;
    availabilityView: string;
    scheduleItems: ScheduleItem[];
    workingHours: WorkingHours;
}

export interface CalendarResponse {
    "@odata.context": string;
    value: ScheduleInformation[];
}
