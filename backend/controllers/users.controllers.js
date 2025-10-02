import User from '../models/users.models.js'
import Profile from '../models/profiles.models.js';
import bcrypt from 'bcrypt'
import crypto from 'crypto'

import PDFDocument from 'pdfkit';
import fs, { existsSync } from'fs';
import ConnectionRequest from '../models/connections.models.js';
import { connect } from 'http2';
import Post from '../models/posts.models.js';
import Comment from '../models/comments.models.js';






// ////// it is making for download profiles ????///// it use in here---(export const downloadProfile=async (req,res)=>)///////////////
const convertUserDataToPDF=async(userData)=>{
 const doc=new PDFDocument();

 const outputPath=crypto.randomBytes(32).toString("hex")+".pdf";


const stream=fs.createWriteStream("uploads/" + outputPath)
doc.pipe(stream)

doc.image(`uploads/${userData.userId.profilePicture}`,{align:'center',width:100})
doc.fontSize(14).text(`Name:${userData.userId.name}`);
doc.fontSize(14).text(`Username:${userData.userId.username}`);
doc.fontSize(14).text(`Email:${userData.userId.email}`);
doc.fontSize(14).text(`Bio:${userData.bio}`);
doc.fontSize(14).text(`current Position:${userData.currentPost}`);


doc.fontSize(14).text("past work")
userData.pastWork.forEach((work,index)=>{
    doc.fontSize(14).text(`company Name:${work.company}`);
    doc.fontSize(14).text(`Position:${work.position}`);
    doc.fontSize(14).text(`years:${work.years}`);
})


doc.end()
return outputPath;

}
//////////////////////////////////////////////////





export const register=async(req,res)=>{
    try{

const {name,email,username,password}=req.body;




if(!name || !email || !username  || !password ) return res.status(400).json({message:"all fields are required"});


 const user=await User.findOne({
    email
 })

 if(user) {
        return res.status(400).json({message:"user already exists hai"})
    }


    const hashedPassword=await bcrypt.hash(password,10) 
    
    const newUser=new User({
        name,
        email,
        password:hashedPassword,
        username
    })
await newUser.save();




// 
const profile=new Profile({
    userId:newUser._id
})
await profile.save()

return res.json({message:"user created"})



}catch(error){
        
        return res.status(500).json({message:error.message})

    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////

export const login=async (req,res)=>{
 

    try{
        const{email,password}=req.body;
        if(!email || !password) {
            return res.status(400).json({message:"all fields are required"})
        }

        // 
        const user=await User.findOne({ email })

        if(!user) return res.status(404).json({message:"user does not exists"})

            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({message:"invalid crentials"})


// /////////////////////////////
             const token=crypto.randomBytes(32).toString("hex")
                  await User.updateOne({_id:user._id},{token})
                         return res.json({token:token})



    }catch(error){  
        return res.status(500).json({message:error.message})
    }

}



//////////////////////////////////////////////////////////////////////////////////////////////////////////


export const uploadProfilePicture= async (req,res)=>{
    
   try{
         const {token} =req.body;
       
        const user =await User.findOne({token:token})

       if(!user){
        return res.status(404).json({message:'users does not exists'})
       }
 
       user.profilePicture=req.file.filename;
       await user.save()
    return res.json({message:'profilePicture updated'})
 

    }catch(error){
        return res.status(500).json({message:error.message})
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////

export const updateUserProfile=async (req,res)=>{
    try{
        const {token, ...newUser}=req.body;
        const user=await User.findOne({token:token})
        if(!user){
            return res.status(404).json({message:'user not found'})
            // const {username,email}=newUser;
        }
         const {username,email}=newUser;
        const existingUser=await User.findOne({$or: [{username},{email}]})
        if(existingUser){
        if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({message:'user alredy exist'})
        }
    }

    Object.assign(user,newUser)
    await user.save();

    return res.json({message:'user updated'})


    }catch(error){
        res.status(500).json({message:error.message})
    }
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getUserAndProfile=async (req,res)=>{
     const {token}=req.query;
    try{
       

        const user=await User.findOne({token:token})
        if(!user){
            return res.status(404).json({message:'user not found'})
        }

        const userProfile=await Profile.findOne({userId:user._id})
        .populate('userId','name  email  username  profilePicture');
        return res.json(userProfile)



    }catch(error){
        return res.status(500).json({message:error.message})
    }

}


             
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const updateProfileData=async (req,res)=>{
    try{
        const {token, ...newProfileData}=req.body;
        const userProfile=await User.findOne({token:token})
        if(!userProfile){
            return res.status(404).json({message:'user not found'})
        } 

        const profile_to_update=await Profile.findOne({userId:userProfile._id})

    Object.assign(profile_to_update,newProfileData)

    await profile_to_update.save();
    return res.json({message:'profile updated'})

    }catch(error){
        return res.status(500).json({message:error.message})
    }

} 


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getAllUsersProfile=async (req,res)=>{
    try{
        const profiles=await Profile.find()
        .populate('userId','name username email profilePicture')

        return res.json({profiles})

    }catch(error){
        res.status(500).json({message:error.message})
    }

}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const downloadProfile=async (req,res)=>{
    try{
        const user_id=req.query.id;
        const userProfile=await Profile.findOne({userId:user_id}).populate('userId','name username email profilePicture')
        let outputPath=await convertUserDataToPDF(userProfile)
        return res.json({"message":outputPath})

        // ab converUserDataToPDF() function to upar banayenge pdfkit libreary ke help se 
        //

        

    }catch(error){
        res.status(500).json({message:error.message})
    }
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const sendConnectionRequest=async(req,res)=>{
     const {token,connectionId}=req.body;
   try{
   
  const user=await User.findOne({token})
  
  if(!user){
    return res.status(404).json({message:"user not found"})
  }

  const connectionUser=await User.findOne({_id:connectionId})
  if(!connectionUser) return res.status(404).json({message:'connection does not found'})

const existingRequest=await ConnectionRequest.findOne(
    {
        userId:user._id,
        connectionId:connectionUser._id
    }
)
console.log("existing request",existingRequest);

if(existingRequest) return res.status(400).json({message:"request already send"})

    const request=new ConnectionRequest({
        userId:user._id,
        connectionId:connectionUser._id
    })

    await request.save();




   }catch(error){
    return res.status(500).json({message:error.message})
   }


}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getMyConnectionRequest = async (req, res) => {
  try {
    const { token } = req.query;

    // Debug: Check token received
    console.log("Received token:", token);

    // Fetch user
    const user = await User.findOne({ token });
    if (!user) {
      console.log("User not found for token:", token);
      return res.status(404).json({ message: "user not found" });
    }

    console.log("User found:", user._id, user.username);

    // Fetch connections
    const connections = await ConnectionRequest.find({ userId: user._id })
      .populate("connectionId", "name username email profilePicture");

    // Debug: Show full connections array
    console.log("Connections array:", JSON.stringify(connections, null, 2));
    console.log("connection is :--",connections);
    

    return res.json( {connections} );
  } catch (error) {
    console.error("Error in getMyConnectionRequest:", error);
    return res.status(500).json({ message: error.message });
  }
};






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const whatAreMyConnections=async (req,res)=>{
    try{
        const {token}=req.query;
        const user=await User.findOne({token})
        if(!user){
            return res.status(404).json({message:"user does not exist"})
        }

        const connections=await ConnectionRequest.find({connectionId:user._id})
        .populate('userId','name username email profilePicture')

        return res.json(connections)

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}



  

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const acceptConnectionRequest=async(req,rse)=>{
    try{
        const{token,requestId,action_type}=req.body;
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'user not exist'})
        }

const connection=await ConnectionRequest.findOne({_id:requestId})

if(!connection){
    return res.status(404).json({message:'connection not found'})
}

if(action_type==="accept"){
    connection.status_accepted=true
}else{
    connection.status_accepted=false
}
await connection.save()
return res.json({message:"request updated"})

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}






// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const commentPost=async(req,res)=>{
    const {token,post_id,commentBody}=req.body;

    try{
        const user=await User.findOne({token:token}).select("_id")

        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        const post=await Post.findOne({_id:post_id})

        if(!post){
            return res.error(404).json({message:"post not found"})
        }

        //
        const comment=new Comment({
            userId:user._id,
            postId:post_id,
            body:commentBody

        })
        await comment.save();
        return res.json({message:"comment added"})

    }catch(error){
        return res.error(500).json({message:error.message})
    }

}







export const getUserprofileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;   // ❌ समस्या यहां हो सकती है
  console.log("backend username:", username);

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name username profilePicture email");

    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
























