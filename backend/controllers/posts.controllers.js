import User from '../models/users.models.js'
import Post from '../models/posts.models.js'
import Profile from '../models/profiles.models.js'
import Comment from '../models/comments.models.js'



export const activecheck=async(req,res)=>{
    return res.status(200).json({message:"running"})
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const createPost=async(req,res)=>{
   
  const {token,body} = req.body;
    try{
      
        
    
 
        const user=await User.findOne({token:token})
        if(!user){
            return res.status(404).json({message:'user not found'})
        }



        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file != undefined ? req.file.filename :"",
            fileType:req.file != undefined ? req.file.mimetype.split("/")[1] : ""

        })
        await post.save();

        return res.status(200).json({message:"post created"})

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getAllPost=async(req,res)=>{
    try{
        const posts=await Post.find().populate('userId','name username enail profilePicture')
        return res.json({posts})

    }catch(error){
        return res.status(500).json({message:error.message})

    }
}





// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const deletePost=async(req,res)=>{
    const {post_id,token}=req.body;
    try{
        const user=await User.findOne({token:token}).select("_id")

        if(!user){
            return res.status(404).json({message:"user not found"})
        }



        const post=await Post.findOne({_id:post_id})

        if(!post){
            return res.status(404).json({message:"post not found"})
        }

        if(post.userId.toString() !== user._id.toString()){
        return res.status(401).json({message:"unuthorized"})
        }

        await Post.deleteOne({_id:post_id})
        return res.json({message:"post deleted"})



    }catch(error){
        return res.status(500).json({message:error.message})
    }
}





// //////////////////////////////////////////////////////////////////////////////////////////////////////////
export const get_comments_by_post=async(req,res)=>{
    const {post_id}=req.query;

    try{
        const post=await Post.findOne({_id:post_id})

        if(!post){
            return res.status(404).json({message:"posts not found"})
        }

        const comments=await Comment.find({postId:post_id})
        .populate("userId","username name")

        return res.json(comments.reverse())

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}





// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const delete_comment_of_user=async (req,res)=>{
    const {token , comment_id}=req.body;

    try{
        const user=await User.findOne({token:token}).select("_id")
        if(!user) {
            return res.status(404).json({message:"user not found"})
        }



          const comment=await Comment.findOne({"_id":comment_id})
          if(!comment){
            return res.status(404).json({message:"comments not found"})
          }
          if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({message:"unAthroized"})
          }
          await Comment.deleteOne({"_id":comment_id})
          return res.json({message:"comments deleted"})

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const increment_likes=async(req,res)=>{
    const{post_id}=req.body;

    try{
        const post=await Post.findOne({_id:post_id})
        if(!post){
            return res.status(404).json({message:"post not found"})
        }

  post.likes=post.likes+1;
  await post.save();

  return res.json({message:"Likes incremented"})


    }catch(error){
        return res.status(500).json({message:error.message})
    }
}