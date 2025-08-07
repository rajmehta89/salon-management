import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Salon from '@/models/Salon';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const { userType, name, email, password, phone, salonName, address, description } = body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (userType === 'salon' && (!salonName || !address)) {
            return NextResponse.json(
                { message: 'Salon name and address are required for salon owners' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create salon if userType is 'salon'
        let salonId = null;
        if (userType === 'salon') {
            const salon = new Salon({
                name: salonName,
                address,
                description: description || null,
            });
            const savedSalon = await salon.save();
            salonId = savedSalon._id;
        }

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: userType === 'salon' ? 'SALON_OWNER' : 'CUSTOMER',
            salon: salonId,
        });

        const savedUser = await user.save();

        return NextResponse.json(
            { message: 'Registration successful', user: { id: savedUser._id, email: savedUser.email, role: savedUser.role } },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}