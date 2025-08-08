import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Staff from '../../../models/Staff';
import Salon from '../../../models/Salon';

// GET - Fetch all staff or filter by salon
export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const salonId = searchParams.get('salonId');

        let query = {};
        if (salonId) {
            query.salonId = salonId;
        }

        const staff = await Staff.find(query)
            .populate('salonId', 'name location')
            .populate('services', 'name price duration');

        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// POST - Create new staff member
export async function POST(request) {
    try {
        await connectToDatabase();
        const staffData = await request.json();

        const staff = new Staff(staffData);
        await staff.save();

        // Add staff reference to salon
        if (staffData.salonId) {
            await Salon.findByIdAndUpdate(
                staffData.salonId,
                { $push: { staff: staff._id } }
            );
        }

        return NextResponse.json(staff, { status: 201 });
    } catch (error) {
        console.error('Error creating staff:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}