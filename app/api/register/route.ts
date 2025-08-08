import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Or 'bcrypt' if you prefer & installed
import connectToDatabase from '../../../lib/mongodb'; // Adjust path if needed
import User from '../../../models/User';
import Salon from '../../../models/Salon';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const { userType, name, email, password, phone, salonName, address, description } = body;

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (userType === 'salon' && (!salonName || !address)) {
            return NextResponse.json({ message: 'Salon name and address are required for salon owners' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let salonId = null;
        if (userType === 'salon') {
            const salon = new Salon({ name: salonName, address, description: description || null });
            const savedSalon = await salon.save();
            salonId = savedSalon._id;
        }

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: userType === 'salon' ? 'salon_owner' : 'customer',
            salon: salonId,
        });

        const savedUser = await user.save();

        return NextResponse.json(
            { message: 'Registration successful', user: { id: savedUser._id, email: savedUser.email, role: savedUser.role } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
