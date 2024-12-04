import React from "react";
import "./WeeklyGrid.css";

interface WeeklyGridProps {
    grid: { [day: string]: { [time: string]: string } };
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ grid }) => {
    const days = Object.keys(grid);

    return (
        <div className="weekly-grid-container">
            <table className="weekly-grid-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        {days.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(grid[days[0]]).map((time) => (
                        <tr key={time}>
                            <th>{time}</th>
                            {days.map((day) => (
                                <td
                                    key={`${day}-${time}`}
                                    style={{
                                        backgroundColor:
                                            grid[day][time] === "Busy"
                                                ? "red"
                                                : grid[day][time] === "Tentative"
                                                ? "gray"
                                                : "white",
                                        color: grid[day][time] !== "Free" ? "white" : "black",
                                    }}
                                >
                                    {grid[day][time]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WeeklyGrid;
