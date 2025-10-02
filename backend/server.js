import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import bcrypt from'bcrypt'
import multer from 'multer';
import pdfkit from 'pdfkit'
import pdfcreatornode from 'pdf-creator-node';


import postsroutes from './routes/posts.routers.js'
import usersroutes from './routes/users.routers.js'



// dotenv.config() 

const app=express()
const port=8989;
app.use(cors())
app.use(express.json())
 



// 
app.use(postsroutes)
app.use(usersroutes)
app.use(express.static("uploads"))

  


// const pass='121121';
// const hased=await bcrypt.hash(pass,10)
// console.log(hased);







const start= async()=>{
     const connectToDb=await mongoose.connect('mongodb+srv://vickykushvaha9:Vicky%401900@linkdinclone.9w41fo9.mongodb.net/?retryWrites=true&w=majority&appName=linkdinClone')
    
    console.log('mongoose is connected');
    
     app.listen(port,()=>{
    
        console.log(`app is listen on port : ${port}`);
        
    })

}
start()
