import { getDatafromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModels";
import { dbConnect } from "@/dbConfig/dbConfig";

dbConnect();

export async function GET(request : NextRequest){

    try {
        const userId = await getDatafromToken(request);
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}