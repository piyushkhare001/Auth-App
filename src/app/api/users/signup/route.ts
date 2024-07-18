import {dbConnect} from '@/dbConfig/dbConfig'
import User from '@/models/UserModels'
import { error } from 'console';
import { NextRequest , NextResponse } from 'next/server';
import bcrypt, { hash } from "bcryptjs"
import {sendEmail} from "@/helpers/mailer"

dbConnect();

export async function POST (request : NextRequest) {

     try {
          const reqBody = await request.json();

          const{username , email, password } = reqBody;

          const user = await User.findOne({email})

         if(user) {
            return NextResponse.json({ error :" user already exits"} , {
                status:400
            })
         }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password , salt)
           
           const newUser= new User({
                username,
                email,
                password : hashedPassword
            })

             const savedUser = await newUser.save()
             console.log(savedUser)

             // send mail
          
             await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
    
            return NextResponse.json({
                message: `user registerd succesfully ` ,
                success : true,
              
                savedUser
            })
            
        


     } catch(err:any){ 
        return NextResponse.json( {error: err.message}, {status:500})
     }
}