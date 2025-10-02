import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../authReducer"
import { getAllComments, getAllPosts } from "../../action/postAction"







const initialState={
      posts:[],
      isError:false,
      postFetched:false,
      isLoading:false,
      loggedIn:false,
      message:"",
      comments:[],
      postId:"",
}




const postSlice= createSlice({
    name:"post",
    initialState,
  reducers:{
    reset:()=>initialState,
    resetPostId:(state)=>{
        state.postId=""
    }  ,

  },
extraReducers:(builder)=>{
   builder
   .addCase(getAllPosts.pending,(state)=>{
   state.isLoading=true,
   state.message="fetching all the posts...."

   })
   .addCase(getAllPosts.fulfilled,(state,action)=>{
   
    state.postFetched=true,
    state.isError=false,
    state.isLoading=false,
    state.posts=action.payload.posts.reverse()
   })

.addCase(getAllPosts.rejected,(state,action)=>{
    state.isError=true,
    state.isLoading=false,
    state.message=action.payload
})

.addCase(getAllComments.fulfilled,(state,action)=>{
  state.postId=action.payload.post_id
  state.comments=action.payload.comments
})


}
})


export const { resetPostId }=postSlice.actions;
export default postSlice.reducer
