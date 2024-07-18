import {dbConnect} from '@/dbConfig/dbConfig'
import User from '@/models/UserModels'
import { NextRequest , NextResponse } from 'next/server';
import bcrypt, { hash } from "bcryptjs"
import jwt from "jsonwebtoken"

dbConnect();

export async function POST(request : NextRequest){
 try {
     const reqbody = await request.json()
     const {email , password} = reqbody;
     
     console.log(reqbody);

     // if user  exits

     const user = await User.findOne({email})
      if (!user) { 
        return NextResponse.json({error: "User does not exist"}, {status: 400})
      }
      console.log('user exits')
    
      // check password is correct

      const validPassword = await bcrypt.compare(password , user.password)

     if(!validPassword){
        return NextResponse.json({error: "Invalid password"}, {status: 400})
     }

     console.log(user);

      
        //create token data

        const tokenData = {
            id : user._id,
            username : user.username,
            email : user.email
        }
        var token = jwt.sign(tokenData, process.env.TOKEN_SECRET! ,{expiresIn: "1d"} );
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })


        response.cookies.set("token", token, {
            httpOnly: true, 
            
        })
        return response;
 } catch (error : any) {
    return NextResponse.json({error: error.message}, {status: 500})
 }

}