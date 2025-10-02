import { BASE_URL } from '@/config';
import styles from './style.module.css'

import { acceptConnectionRequest, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { connection } from 'next/server';
import { useRouter } from 'next/router';



export default function MyConnections() {

  const router=useRouter()
  const dispatch=useDispatch();
 const authState=useSelector((state)=>state.auth)

  useEffect(()=>{
   
    dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))
  },[])




  useEffect(()=>{
    if(authState.connectionRequest.length !=0){
      console.log(authState.connectionRequest);
      
    }
  },[authState.connectionRequest])





  return (
    <UserLayout>
        <DashBoardLayout>
            <div style={{display:"flex", flexDirection:"column",gap:"1.7rem"}}>
                <h1>MY connection</h1>
                {authState.connectionRequest.length ===0  && <h1>no connection here</h1>}

                {authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connection)=> connection.status_accepted ===null).map((user,index)=>{
                  return(
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }}  className={styles.userCard} key={index}>
                      <div  style={{display:"flex" , alignItems:"center"}}>

                        <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                        </div>

                        <div className={styles.userInfo} >
                             <h3>{user.userId.name}</h3>
                             <p>{user.userId.username}</p>
                        </div>

                           <button onClick={(e)=>{
                            e.stopPropagation();
                            dispatch(acceptConnectionRequest({
                              connectionId:user._id,
                              token:localStorage.getItem("token"),
                              action:"accept"
                            }))
                           }} className={styles.connectedButton}>Accept</button>


                      </div>
                    </div>
                  )
                 
                })

                }


                     <h4>my Network</h4>
                   


                {authState.connectionRequest.filter((connection)=> connection.status_accepted !==null).map((user,index)=>{
                       return(
                        <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }}  className={styles.userCard} key={index}>
                      <div  style={{display:"flex" , alignItems:"center"}}>

                        <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                        </div>

                        <div className={styles.userInfo} >
                             <h3>{user.userId.name}</h3>
                             <p>{user.userId.username}</p>
                        </div>

                            

                      </div>
                    </div>

                       )
                })

                }
            </div>
        </DashBoardLayout>
    </UserLayout>
  )
}
