


import { BASE_URL, clientServer } from '@/config';
import DashBoardLayout from '@/layout/DashBoardLayout';
import { useSearchParams } from 'next/navigation'
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';


export default function ViewProfilePage({ userProfile }) {

  
  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
const[isConnectionNull,setIsConnectionNull]=useState(true)


  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequest({ token: localStorage.getItem('token') }));
    await dispatch(getMyConnectionRequests({token:localStorage.getItem('token')}))
  };

  // filter posts of this profile
  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts, router.query.username]);

  // check if already connected
  useEffect(() => {
            if ( authState.connections.some( user => user.connectionId._id === userProfile.userId._id)) {
              setIsCurrentUserInConnection(true);
              if(authState.connections.find(user =>user.connectionId._id === userProfile.userId._id).status_accepted ===true) {
              setIsConnectionNull(false)
                }
                }

                // 

                if ( authState.connectionRequest.some( user => user.userId._id === userProfile.userId._id)) {
              setIsCurrentUserInConnection(true);
              if(authState.connectionRequest.find(user =>user.userId._id === userProfile.userId._id).status_accepted ===true) {
              setIsConnectionNull(false)
                }
                }
                 }, [authState.connections,authState.connectionRequest]);

  //!!!!!@@@!!!!similar or just old as just above line      }, [authState.connections, userProfile.userId._id]);

  useEffect(() => {
    getUserPost();
  }, []);








  return (
    <div>
      {userProfile ? (
        <>
          <UserLayout>
            <DashBoardLayout>
              <div className={styles.container}>
                {/* 1st child of container */}
                <div className={styles.backDropContainer}>
                  <img
                    className={styles.backDrop}
                    src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                    alt=""
                  />
                </div>



 {/* 2st child of container */}
                <div className={styles.profileContainer_details}>
                  <div className={styles.profileContainer_flex}>
                    <div style={{ flex: '0.7' }}>
                      <div
                        style={{
                          display: 'flex',
                          width: 'fit-content',
                          alignItems: 'center',
                          gap:"1.2rem"
                        }}
                      >
                        <h2>{userProfile.userId?.name}</h2>
                        <p style={{ color: 'grey' }}>
                          @{userProfile.userId?.username}
                        </p>
                      </div>

{/*  */}
                     <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                       {
                      isCurrentUserInConnection ? 
                        <button className={styles.connectedButton}>
                        {
                        isConnectionNull ? "pending":"Connected"
                        }
                        </button>
                       : 
                        <button
                          onClick={() => {
                            dispatch( sendConnectionRequest({  token: localStorage.getItem('token'), user_id: userProfile.userId._id,
                              })
                            );
                          }}
                          className={styles.connectButton}
                        >
                          Connect
                        </button>
                      }

                   <div  onClick={async()=>{
                    const response=await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`); ///error//////////////// here
                    window.open(`${BASE_URL}/${response.data.message}`,"_blank")

                   }}>
                      
                        <svg  style={{width:"1.4em",alignItems:"center",cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                     
                   </div>
                     </div>

{/*  */}
                      <div>
                        <p>{userProfile.bio}</p>
                      </div>
                    </div>
                    <div style={{ flex: '0.3' }}>
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
                          </div>
                        </div>





              </div>
            </DashBoardLayout>
          </UserLayout>
        </>
      ) : (
        <h2>User not found</h2>
      )}
    </div>
  );
}

// ssr   (server side rendering) from here
export async function getServerSideProps(context) {
  try {
    const { username } = context.query;

    const request = await clientServer.get(
      '/user/get_user_profile_based_on_username',
      { params: { username } }
    );

    return {
      props: {
        userProfile: request.data.profile,
      },
    };
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    return {
      props: { userProfile: null },
    
      
    };
  }
}

