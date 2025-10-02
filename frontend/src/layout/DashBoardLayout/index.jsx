import React, { useEffect } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { setTokenIsThere } from '@/config/redux/reducer/authReducer'
import { useDispatch, useSelector } from 'react-redux'

export default function DashBoardLayout({children}) {
  
  const router=useRouter()
  const dispatch=useDispatch()
const authState=useSelector((state)=> state.auth)


   useEffect(()=>{
          if(localStorage.getItem('token') === null){
              router.push('/login')
          }
        dispatch( setTokenIsThere())
      })


  return (
    

        <div className={styles.container}>
           
      <div className={styles.homeContainer}>


        <div className={styles.homeContainer_leftBar}>   
           <div className={styles.sideBarOptions} onClick={()=> router.push('/dashboard')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                 </svg>

                 <p>Home</p>

                 

           </div>

            <div className={styles.sideBarOptions} onClick={()=> router.push('/discover')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                 <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>


                 <p>Discover</p>

                 

           </div>

              <div className={styles.sideBarOptions} onClick={()=> router.push('/my_connections')}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                 </svg>


                 <p>My Connection</p>

                 

           </div>

        </div>


        <div className={styles.homeContainer_feedContainer}>
          {children}
{/* yaha par  --> homeContainer_feedContainer) ke andar  {children}  dene ka matlab ye hai ki  jaha par bhi ham es 
<DashboardLayout/> component ko use karenge and uske ander ka jo bhi <div> hoga oo   eska {children} hoga  like:  
 <DashboardLayout> <div> jo bhi yaha content hoga </div><DashboardLayout> */}
          
         </div>




       <div className={styles.homeContainer_extraContainer}>  
        <h3>Top Profiles </h3>  
        {authState.all_profile_fetched && authState.all_users.map((profiles)=>{
          return (
            <div key={profiles._id} className={styles.extraContainer_profile}>
              <p>{profiles.userId.name}</p>
              
             </div>
          )


        })
        }         

     


       </div>

       </div>
     


     

{/* ///////////////////////////////////////////////////////////////////////////////////////////// */}
       {/* mobile navbar for responsive */}
       <div className={styles.mobileNavBar}>
        <div  onClick={()=>{
          router.push('/dashboard')
        }} className={styles.singleNavItemHolder_mobileView}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                 </svg>
        </div>


              <div onClick={()=>{
                router.push('/discover')
              }} className={styles.singleNavItemHolder_mobileView}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                 <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
        </div>



          <div onClick={()=>{
            router.push('/my_connections')
          }} className={styles.singleNavItemHolder_mobileView}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                 </svg>
        </div>


        
       </div>

   </div>
   
   
  )
}
