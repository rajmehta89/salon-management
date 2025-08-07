import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { email, password, userType } = await request.json();

        // Validate required fields
        if (!email || !password || !userType) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email, role: userType === 'salon' ? 'SALON_OWNER' : userType.toUpperCase() });
        if (!user) {
            return NextResponse.json({ message: 'Invalid email or user type' }, { status: 401 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        // Mock token (in a real app, use JWT)
        const token = 'mock-jwt-token'; // Replace with actual JWT logic

        return NextResponse.json(
            { message: 'Login successful', token, user: { id: user._id, email: user.email, role: user.role } },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}