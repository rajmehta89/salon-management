import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Staff from '../../../../models/Staff';
import Salon from '../../../../models/Salon';

// GET - Fetch staff by ID
export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const staff = await Staff.findById(id)
            .populate('salonId', 'name location')
            .populate('services', 'name price duration');

        if (!staff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }

        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// PUT - Update staff member
export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;
        const updateData = await request.json();

        const staff = await Staff.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!staff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }

        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('Error updating staff:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// DELETE - Delete staff member
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const staff = await Staff.findByIdAndDelete(id);

        if (!staff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }

        // Remove staff reference from salon
        await Salon.findByIdAndUpdate(
            staff.salonId,
            { $pull: { staff: id } }
        );

        return NextResponse.json({ message: 'Staff member deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting staff:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}