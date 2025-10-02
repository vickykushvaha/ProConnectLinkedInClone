import { getAboutUser } from '@/config/redux/action/authAction'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import styles from './style.module.css'
import { BASE_URL, clientServer } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction'


export default function ProfilePage() {

    const dispatch=useDispatch()
     const authState=useSelector((state)=> state.auth)
     const postReducer=useSelector((state)=> state.postReducer)
     const [userProfile,setUserProfile]=useState({})
     const [userPosts,setUserPosts]=useState([])
     const [isModalOpen, setIsModalOpen]=useState(false)

// ///////////////////// same as useState ////////////////////////////////////////////
const[inputData,setInputData]=useState({company:'',position:'',years:''})     

const handleWorkInputChange=(e)=>{
      const {name,value}=e.target;
      setInputData({...inputData,[name]:value});
     }
///////////////////////////////////////////////////////////////////

useEffect(()=>{
    dispatch(getAboutUser({token:localStorage.getItem("token")}))
dispatch(getAllPosts())
},[])



useEffect(()=>{
   
      

    if(authState.user !=undefined){
 setUserProfile(authState.user)

      let post = postReducer.posts.filter((post)=>{
    return post.userId.username === authState.user.userId.username
  })
setUserPosts(post)
}


},[authState.user , postReducer.posts])

///////////////////////////////////////////////////////
const updateProfilePicture=async(file)=>{
  const formData=new FormData();
  formData.append("profile_picture",file);
  formData.append("token",localStorage.getItem('token'));


  const response=await clientServer.post('/update_profile_picture',formData,{
    headers:{
      'Content-Type':'multipart/form-data'
    },
  })

  dispatch(getAboutUser({token:localStorage.getItem("token")}))

}

///////////////////////////////////////////////////////
const updateProfileData=async()=>{
  const request=await clientServer.post('/user_update',{
    token:localStorage.getItem("token"),
    name:userProfile.userId.name,
  })

  const response=await clientServer.post("/update_profile_data",{
    token:localStorage.getItem('token'),
    bio:userProfile.bio,
    currentPost:userProfile.currentPost,
    pastWork:userProfile.pastWork,
    education:userProfile.education
  })

  dispatch(getAboutUser({token:localStorage.getItem("token")}))
}



  return (
 
   <UserLayout>
    <DashBoardLayout>
        

{authState.user &&userProfile && userProfile.userId &&

                  <div className={styles.container}>
                {/* 1st child of container */}
                <div className={styles.backDropContainer}>
                <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
                  <p>Edit</p>
                </label>
                <input onChange={(e)=>{
                  updateProfilePicture(e.target.files[0])
                }}
                  hidden type="file" id='profilePictureUpload' />
                  <img  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                    alt="" />
                    
                





                
                </div>



 {/* 2st child of container */}
                <div className={styles.profileContainer_details}>
                  <div style={{ display: 'flex', gap: '0.7rem' }}>
                    <div style={{ flex: '0.8' }}>
                      <div style={{  display: 'flex',width: 'fit-content',alignItems: 'center'}}>
                      <input  className={styles.nameEdit} type="text"
                      value={userProfile.userId.name}  onChange={(e)=>{
                        setUserProfile({...userProfile, userId:{...userProfile.userId  , name:e.target.value}})
                      }} />
         
                        <p style={{ color: 'grey' }}>
                          @{userProfile.userId.username}
                        </p>


                       

                        <br /><br /><br />
                       
                      </div>

                      
                      &nbsp;&nbsp; <b>BIO:- </b> 
                      <div>
                      <textarea value={userProfile.bio}
                        onChange={(e)=>{
                          setUserProfile({...userProfile,bio:e.target.value})
                        }}
                        rows={Math.max(3,Math.ceil(userProfile.bio.length /80))} 
                        style={{width:"60%"}} placeholder={"what's your bio"}></textarea>
                    </div>
                      {/* ////////////////////////////////////////// */}
                       {
                      userProfile != authState.user &&
                      <div  onClick={()=>{
                        updateProfileData()
                      }} className={styles.updatProfileBtn}>
                        update Profile
                      </div>
                            }
                      {/* ////////////////////////////////////////// */}








{/*  */}
                      {/* <div>
                        <p>{userProfile.bio}</p>
                      </div> */}
                    </div>
                    <div style={{ flex: '0.2' }}>
                      <p style={{ fontWeight: 'bold' }}>Recent Activity</p>
                      {userPosts.map((post) => {
                        return (
                          <div key={post._id} className={styles.postCard}>
                            <div className={styles.card}>
                              <div className={styles.card_profileContainer}>
                                {post.media !== '' ? (
                                  <img src={`${BASE_URL}/${post.media}`} alt="" />
                                ) : (
                                  <div
                                    style={{ width: '3.4rem', height: '3.4rem' }}
                                  ></div>
                                )}
                              </div>
                              <p>{post.body}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>



 {/* 3st child of container */}
                        <div className={styles.workHistory}>
                          <h4>Work History</h4>
                          <div className={styles.workHistoryContainer}>
                            {
                              userProfile.pastWork.map((work,index)=>{
                                return(
                                  <div key={index} className={styles.workHistoryCard}>
                                    <p><b>Company :-</b>&nbsp; {work.company}  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;

                                      <b>Position:- </b>&nbsp; {work.position}</p>
                                    <p><b>Work:- </b> &nbsp;{work.years}</p>
                                   
                                    

                                  </div>
                                )
                              })
                            }

                            <button className={styles.addWorkBtn} onClick={()=>{
                              setIsModalOpen(true)
                            }}>
                              Add Work
                            </button>
  {/* ////////////////////////////////////////// */}
                       {
                      userProfile != authState.user &&
                      <div  onClick={()=>{
                        updateProfileData()
                      }} className={styles.updatProfileBtn}>
                        update Profile
                      </div>
                            }
                      {/* ////////////////////////////////////////// */}

                          </div>
                        </div>

    
                    

              </div>

                        }








{/* ///////////////////////////////////////////////////////////////// */}



{
       isModalOpen  &&
        <div
        onClick={()=>{
          setIsModalOpen(false)
        
        }} className={styles.commentsContainer}>
          <div onClick={(e)=>{
           e.stopPropagation()
          }}
           className={styles.allCommentsContainer}>
             <input onChange={handleWorkInputChange} name='company'  type='text' placeholder='Enter Company Pame'   className={styles.inputField}/>
             <input onChange={handleWorkInputChange} name='position'  type='text' placeholder="Your Position"   className={styles.inputField}/>
             <input onChange={handleWorkInputChange} name='years'  type='number' placeholder='exp of year'   className={styles.inputField}/>
           

           <div onClick={()=>{
            setUserProfile({...userProfile, pastWork:[...userProfile.pastWork, inputData]})
            setIsModalOpen(false)

           }} className={styles.updatProfileBtn}> add work</div>
          </div>
        </div>
      }
    </DashBoardLayout>
   </UserLayout>
    
  )
}
