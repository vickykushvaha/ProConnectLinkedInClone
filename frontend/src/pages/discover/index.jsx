import { getAllUsers } from '@/config/redux/action/authAction'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styles from './index.module.css'
import { BASE_URL } from '@/config'
import {  useRouter } from 'next/router'



export default function DiscoverPage() {
  const authState=useSelector((state)=> state.auth)
  const dispatch=useDispatch()

  useEffect(()=>{
    if(!authState.all_profile_fetched){
      dispatch(getAllUsers())
    }

  },[])

  
const router=useRouter();

  return (
   <UserLayout>
    <DashBoardLayout>
        <div>
            <h1>Discover</h1>
            <div className={styles.allUserProfile}>
              {authState.all_profile_fetched && authState.all_users.map((user)=>{
              return(
                <div onClick={()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }} 
                key={user._id} className={styles.userCard}>
                  <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />

                  <div>
                    <h2>{user.userId.name}</h2>
                    <p>{user.userId.username}</p>
                  </div>

                   </div>
              )
            })}
            </div>
           
        </div>
    </DashBoardLayout>
   </UserLayout>
  )
}
