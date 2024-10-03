import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import getUserData from '../../getUserData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body || {};
    const userData :any= await getUserData();

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, userData.password);
    // if (!isMatch) {
    //   return NextResponse.json(
    //     { message: 'Current password is incorrect' },
    //     { status: 400 },
    //   );
    // }

    // Check if new password and confirm password match
    // if (newPassword !== confirmPassword) {
    //   return NextResponse.json(
    //     { message: 'New password and confirm password do not match' },
    //     { status: 400 },
    //   );
    // }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await prisma.user.update({
      where: { id: userData.id }, // Assuming you have user id from userData
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { message: 'Error updating password' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
