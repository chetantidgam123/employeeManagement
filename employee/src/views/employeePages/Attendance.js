import moment from 'moment'
import React from 'react'
import { postCall } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'

const Attendance = () => {


    const PunchIn = async () => {
        let jbody = {
            day:moment().date(),
            year:moment().year(),
            month:moment().month()+1
        }
        await postCall('/attendance/punchIn',jbody ).then((result) => {
            if (result.data.code == 200) {
                success_toast(result.data.message)
                // navigate('/emplist')
            } else {
                error_toast(result.data.message)
            }
        })
            .catch((err) => {
                error_toast(err.response.data.message)
            })
    }
  return (
    <div>
        <button onClick={PunchIn}>Punch In</button>
    </div>
  )
}

export default Attendance