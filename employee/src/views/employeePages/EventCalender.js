import React, { useState } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const EventCalender = () => {
    const [myEventsList, setMyEventList] = useState([
        {
            start: moment().toDate(),
            end: moment().toDate(),
            title: "Today Event",
            resource: "dsadadadasdasdadadada",
            color: 'red'

        }
    ])

    function eventStyleGetter(event, start, end, isSelected) {
        const style = {
            backgroundColor: event.color, // Set the background color based on the event's color property
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
        };

        return {
            style,
        };
    }
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={(e) => { console.log(e); }}
                onDrillDown={(e) => { console.log(e) }}
                eventPropGetter={eventStyleGetter}
            />
        </div>
    )
}

export default EventCalender