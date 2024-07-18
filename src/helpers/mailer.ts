
import nodemailer from 'nodemailer';
import User from "@/models/UserModels";
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        // create a hased token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                 
              $set :  {
                    verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000
                }

                })
            

        }else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                {
                    $set : {
                        forgotPasswordToken: hashedToken,
                        forgotPasswordTokenExpiry: Date.now() + 3600000
                    }
                })
                
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASS
              //TODO: add these credentials to .env file
            }
          });


        const mailOptions = {
            from: 'piyush@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
                        
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            padding: 10px 0;
            text-align: center;
            color: #ffffff;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            color: #777777;
            font-size: 12px;
            padding: 10px 0;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>${emailType}</h1>
        </div>
        <div class="content">
            <p>Hello ${email},</p>
            <p>Thank you for being a valued customer. We wanted to let you know about our latest updates and offers.</p>
           <p> click here <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> </a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>
            <p>Best regards,<br> by piyush khare</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Piyush khare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
` // html body
          
        }

        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}