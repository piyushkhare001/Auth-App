import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export  async function dbConnect() {
    try{
      
         mongoose.connect(process.env.DATABASE_URL! )
        const connection  = mongoose.connection;
       connection.on( 'conected' , ()=>{
        console.log('Connection pura hua')
       })   
       connection.on( 'error' , (err)=>{
        console.log('did not connect' , err)
        process.exit();
       })   
    }
    catch(err){
        console.log( "getting error" , err)

    }

    
}