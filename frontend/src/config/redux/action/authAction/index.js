import { clientServer } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { connection } from "next/server";



export const loginUser=createAsyncThunk(
    "user/login",
    async (user,thunkAPI)=>{
        try{
            const response=await clientServer.post('/login',{
                email:user.email,
                password:user.password
            })

            if(response.data.token){
                  localStorage.setItem("token",response.data.token)
            }else{
                return thunkAPI.rejectWithValue(error.response.data)
            }

                
// 
return thunkAPI.fulfillWithValue(response.data.token)



        }catch(error){
       return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)




//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registerUser=createAsyncThunk(
    "user/register",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post('/register',{
                username:user.username,
                name:user.name,
                password:user.password,
                email:user.email,
            })

        }catch(error){
   return thunkAPI.rejectWithValue(error.response.data)
        }   
     }
)





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async (user,thunkAPI)=>{
        try{

            const response=await clientServer.get('/get_user_and_profile',{
                params:{
                    token:user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)




// ///////////////////////////////////////////////////////////////////////////////
export const getAllUsers=createAsyncThunk(
    "user/getAllUsers",
    async (_,thunkAPI)=>{
        try{
            const response=await clientServer.get('/user/get_all_users')
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
           return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)






// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const sendConnectionRequest=createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post('/user/send_connection_request',{
                token:user.token,
                connectionId:user.user_id
            })

            thunkAPI.dispatch(getConnectionRequest({token:user.token}))

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }

)






// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getConnectionRequest=createAsyncThunk(
    "user/getConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.get('/user/get_my_connection_request',{
              params:{
                token:user.token
              }
            })

            return thunkAPI.fulfillWithValue(response.data.connections)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)







// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getMyConnectionRequests=createAsyncThunk(
    "user/getMyConnectionRequests",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.get('/user/user_connection_request',{
                params:{
                    token:user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)







// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const acceptConnectionRequest=createAsyncThunk(
    "user/acceptConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post('/user/accept_connection_request',{
                token:user.token,
                requestId:user.connectionId,
                action_type:user.action
            })
           thunkAPI.dispatch(getConnectionRequest({token:user.token}))
           thunkAPI.dispatch(getMyConnectionRequests({token:user.token}))
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)





// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////