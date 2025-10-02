import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/redux/action/authAction'
import { reset } from '@/config/redux/reducer/authReducer'


export default function NavBarComponent() {
  const router=useRouter()
const dispatch=useDispatch()


  const authState=useSelector((state) => state.auth)

  return (
    <div>

      
      <div className={styles.container}>
       <div className={styles.navBar}>
       <h3 style={{cursor:"pointer"}} onClick={()=>{
        router.push("/")
      }} className={styles.proConnectButton}>ProConnect</h3>
      

    {authState.profileFetched &&<div> 
     <div style={{display:'flex',gap:'1.2rem'}} 
     className={styles.navBarLoggedIn}>

       <p className={styles.navText}  >hey,{authState.user.userId.name}</p>

       <p style={{fontWeight:'bold',cursor:'pointer'}}
       onClick={()=>{
        router.push('/profile')
       }} className={styles.navButton} >Profile</p>

       <p  className={styles.navButton} style={{fontWeight:'bold',cursor:'pointer'}}  onClick={()=>{
        localStorage.removeItem('token')
        router.push('/login')
        dispatch(reset())
        
       }}>LogOut</p>
     </div>

      </div>
      }

   
     {!authState.profileFetched &&  
       <div  className={styles.navBarLoggedOut}>
        <p onClick={()=>{
          router.push("/login")
        }} className={styles.buttonJoin}>Be A Part</p>
      </div>
}
  
    
     </div>
      </div>
    </div>
  )
}
