export const dynamic = "force-dynamic";
// // File: /app/api/user/post/update-password/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import prisma from '@/prisma'; // Make sure prisma client is properly set up
// import jwt from 'jsonwebtoken'; // JWT for verifying the token
// import { User } from 'types/User';
// // import { User } from '@/types/User'; // Import the User type

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

// export async function POST(request: NextRequest) {
//   try {
//     const { token, newPassword, confirmPassword } = await request.json();
//     console.log('Received request:', { token, newPassword, confirmPassword });

//     // Check if newPassword and confirmPassword match
//     if (newPassword !== confirmPassword) {
//       console.error('Password mismatch: New password and confirm password do not match');
//       return NextResponse.json(
//         { message: 'New password and confirm password do not match' },
//         { status: 400 }
//       );
//     }

//     // Verify the token
//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
//       console.log('Decoded token:', decoded);
//     } catch (err) {
//       console.error('Invalid or expired token:', err);
//       return NextResponse.json(
//         { message: 'Invalid or expired token' },
//         { status: 400 }
//       );
//     }

//     // Extract email from token
//     const { email } = decoded;
//     console.log('Extracted email from token:', email);

//     // Find the user by email and cast to User type
//     const user: User | null = await prisma.user.findUnique({
//   where: { email },
// });

//     console.log("passwordResetTokens", user?.passwordResetTokens);

//     if (!user) {
//       console.error('User not found with email:', email);
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Check if the token has already been used
//     if (user.passwordResetTokens.includes(token)) {
//       console.error('Password reset token has already been used');
//       return NextResponse.json(
//         { message: 'This password reset token has already been used.' },
//         { status: 400 }
//       );
//     }

//     // Check if the new password has been used before
//     const isOldPassword = await Promise.all(
//       user.passwordHistory.map(async (oldPassword: string) => {
//         return await bcrypt.compare(newPassword, oldPassword);
//       })
//     );

//     if (isOldPassword.some((match:any) => match)) {
//       console.error('New password cannot be one of the old passwords');
//       return NextResponse.json(
//         { message: 'This password has been used before and cannot be reused.' },
//         { status: 400 }
//       );
//     }

//     // Hash the new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);
//     console.log('New hashed password generated');

//     // Update user's password, mark the token as used, and add the new password to history
//     await prisma.user.update({
//       where: { email },
//       data: {
//         password: hashedPassword,
//         passwordResetTokens: {
//           push: token, // Add the token to the array of used tokens
//         },
//         passwordHistory: {
//           push: hashedPassword, // Add the new password to history
//         },
//       },
//     });

//     console.log('Password updated successfully for user:', email);

//     // Return success response
//     return NextResponse.json(
//       { message: 'Password updated successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error updating password:', error);
//     return NextResponse.json(
//       { message: 'Error updating password' },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/prisma';
import jwt from 'jsonwebtoken';
import { User } from 'types/User';


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

// Updated User interface to match Prisma model
// interface User {
//   id: string;
//   email: string;
//   username: string | null;
//   phone: string | null;
//   password: string;
//   senders: any;
//   date: Date;
//   library: any;
//   accountData: any;
//   createdAt: Date;
//   updatedAt: Date;
//   savedList: any;
//   passwordResetToken: string | null;
//   passwordResetTokens: string[];
//   passwordHistory: string[];
//   passwordResetTokenExpiry: Date | null;
// }

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();
    console.log('Received request:', { token, newPassword, confirmPassword });

    if (newPassword !== confirmPassword) {
      console.error('Password mismatch: New password and confirm password do not match');
      return NextResponse.json(
        { message: 'New password and confirm password do not match' },
        { status: 400 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('Invalid or expired token:', err);
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const { email } = decoded;
    console.log('Extracted email from token:', email);

    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });

    console.log("passwordResetTokens", user?.passwordResetTokens);

    if (!user) {
      console.error('User not found with email:', email);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.passwordResetTokens.includes(token)) {
      console.error('Password reset token has already been used');
      return NextResponse.json(
        { message: 'This password reset token has already been used.' },
        { status: 400 }
      );
    }

    const isOldPassword = await Promise.all(
      user.passwordHistory.map(async (oldPassword: string) => {
        return await bcrypt.compare(newPassword, oldPassword);
      })
    );

    if (isOldPassword.some((match: boolean) => match)) {
      console.error('New password cannot be one of the old passwords');
      return NextResponse.json(
        { message: 'This password has been used before and cannot be reused.' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('New hashed password generated');

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordResetTokens: {
          push: token,
        },
        passwordHistory: {
          push: hashedPassword,
        },
      },
    });

    console.log('Password updated successfully for user:', email);

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { message: 'Error updating password' },
      { status: 500 }
    );
  }
}