import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

function LoginComponent() {


  const authState=useSelector((state)=> state.auth)

  const router=useRouter()
  const dispatch=useDispatch()
  
  const [userLoginMethod,setUserLoginMethod]=useState(false)
  const [username,setUsername]=useState("")
  const [name,setName]=useState("")
  const [email,setEmail]=useState("");
  const [password,setPasswod]=useState("")


  
  

 const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
   
  }, []);

  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      }
    }
  }, [mounted]);








  useEffect(()=>{
    dispatch(emptyMessage())

  },[userLoginMethod])





//////////////////////////////////////////////////////////////////////////////////////////
// register handle

  const handleRegister=()=>{  
    console.log('registring.....');
    
 dispatch(registerUser({username,name,email,password}))
   

 .then(()=>{
  handleLogin()
 })
  }

  // handle login
const handleLogin=()=>{
  console.log('logingingg...');

  
  dispatch(loginUser({email,password}))
  .then(() => {
      // Force full page reload after successful signup
      window.location.reload();
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
   <UserLayout>
    <div className={styles.container}>
      <div className={styles.cardContainer}>

      <div className={styles.cardContainer_left}>
        <p className={styles.cardContainer_left_heading}>
          {userLoginMethod ? "Sign In" :"sign Up"}</p>
         <p style={{color:authState.isError ? "red" :"green"}}>{authState.message.message}</p>

        {/* {////////////////////////////////////////////////////} */}
          
       <div className={styles.inputContainer}>

         {!userLoginMethod &&
           <div className={styles.inputRow}>
            <input onChange={(e)=> setUsername(e.target.value)} 
            type='text' placeholder='username' 
          className={styles.inputField}/>

          <input onChange={(e)=>setName(e.target.value)}
           type='text' placeholder='name' 
          className={styles.inputField}/>
           
          </div>
}



           <input onChange={(e)=> setEmail(e.target.value)} 
           type="email" placeholder='email' required
          className={styles.inputField}/>

           <input onChange={(e)=> setPasswod(e.target.value)} 
           type="password" placeholder='password' 
          className={styles.inputField}/>


          <div className={styles.buttonWithOutline}
          onClick={()=>{
            if(userLoginMethod ){
               handleLogin()
            }else{
              handleRegister()
            }
          }}>
            <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
          </div>

       </div>

{/*  */}


      </div>
      


      {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
      <div className={styles.cardContainer_right}>
    

       <p>{userLoginMethod ? "We don't have any account" : "Already have an account"} </p>
        <div style={{color:"black" ,textAlign:'center',background:'white'}} className={styles.buttonWithOutline}
          onClick={()=>setUserLoginMethod(!userLoginMethod)
          }>
            <p>{userLoginMethod ? "Sign Up" : "Sign IN"}</p>
          </div>

        </div>

      </div>
 
   
    </div>
   </UserLayout>
    </div>
  )
}

export default LoginComponent
