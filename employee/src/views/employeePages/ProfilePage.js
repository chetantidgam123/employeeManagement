import React, { useEffect, useState } from 'react'
import { getCall, imgUrl } from 'src/Services/service'
import './profilePage.scss'
const ProfilePage = () => {
    const [profile, setProfile] = useState({})
    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        await getCall('users/getEmployeeProfile')
            .then((result) => {
                if (result.data.code == 200) {
                    setProfile(result.data.data[0])
                    console.log(profile);
                } else {
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <>
            {profile && <div className='p-3' style={{ width: '70%', margin: 'auto', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                <div className='text-center'>
                    <img alt="" srcSet={imgUrl + 'uploads/profilepics/' + profile.profile_photo} style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
                    <h3 className='mt-2'>{profile.firstname + ' ' + profile.lastname}</h3>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <label htmlFor="name">Employee Id</label>
                        <input type="text" className="form-control" value={profile.emp_id} readOnly />
                        <label htmlFor="name">Role</label>
                        <input type="text" className="form-control" value={profile.designation} readOnly />
                        <label htmlFor="name">Email Id</label>
                        <input type="text" className="form-control" value={profile.email_id} readOnly />
                        <label htmlFor="name">Date of Joining</label>
                        <input type="text" className="form-control" value={profile.doj} readOnly />
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default ProfilePage