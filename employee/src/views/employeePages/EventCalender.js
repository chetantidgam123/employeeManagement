import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getCall, postCall } from 'src/Services/service';
import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
const localizer = momentLocalizer(moment);
const EventCalender = () => {
    const [modalData, setModalData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [myEventsList, setMyEventList] = useState([])


    useEffect(() => {
        let a = new Date()
        getLeaveByEmpIdAndMonth(moment(a).startOf('month').format('YYYY-MM-DD'))
    }, [])

    const getLeaveByEmpIdAndMonth = async (month) => {
        await postCall('/leaves/getLeaveByEmpIdAndMonth', { month: month })
            .then(async (result) => {
                if (result.data.code == 200) {
                    let a = result.data.data
                    a = await a.map((e) => {
                        e.start = e.leave_date
                        e.end = e.leave_date
                        return e
                    })
                    getAllHolidaysList(a)
                    // setMyEventList(a)
                } else {
                    let a = []
                    getAllHolidaysList(a)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const getAllHolidaysList = async (a) => {
        await getCall('holiday/getHolidaysList_emp', {})
          .then((result) => {
            if (result.data.status) {
                let holidays =result.data.data
                for(let i =0;i<holidays.length;i++){
                    let obj = {
                        start:holidays[i].date,
                        end:holidays[i].date,
                        resource:holidays[i].description,
                        title:holidays[i].title,
                        color:holidays[i].color,
                    }
                    a.push(obj)

                }
                setMyEventList(a)
            }
           
          })
          .catch((err) => {
           
          })
      }
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
    const changeMonth = async (e) => {
        if (e.start) {
            let a = moment(e.start).format('YYYY-MM-DD')
            getLeaveByEmpIdAndMonth(a)
        }
    }
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={(e) => { setVisible(true); setModalData(e) }}
                onDrillDown={(e) => { console.log(e) }}
                eventPropGetter={eventStyleGetter}
                onRangeChange={(e) => { changeMonth(e) }}
            />
            {modalData && <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Leaves Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <div className='mb-2'>
                            <small className='mb-2'>Title</small>
                            <p>{modalData.title}</p>
                        </div>
                        <div className='mb-2'>
                            <small className='mb-2'>Leave Date</small>
                            <p>{moment(modalData.start).format('DD-MM-YYYY')}</p>
                        </div>
                        <div className='mb-2'>
                            <small className='mb-2'>Discription</small>
                            <p>{modalData.resource}</p>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    {/* <CButton color="primary">Save changes</CButton> */}
                </CModalFooter>
            </CModal>}
        </div>
    )
}

export default EventCalender