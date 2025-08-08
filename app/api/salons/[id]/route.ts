import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Salon from '../../../../models/Salon';

// GET - Fetch salon by ID
export async function GET(request, { params }) {
    try {

        await connectToDatabase();
        const { id } = await params;

        const salon = await Salon.findById(id)
            .populate('staff', 'name speciality status')
            .populate('servicesList', 'name price duration category')
            .populate('bookings', 'customerName bookingDate status');

        if (!salon) {
            return NextResponse.json({ message: 'Salon not found' }, { status: 404 });
        }

        return NextResponse.json(salon, { status: 200 });
    } catch (error) {
        console.error('Error fetching salon:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// PUT - Update salon
export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;
        const updateData = await request.json();

        const salon = await Salon.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!salon) {
            return NextResponse.json({ message: 'Salon not found' }, { status: 404 });
        }

        return NextResponse.json(salon, { status: 200 });
    } catch (error) {
        console.error('Error updating salon:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// DELETE - Delete salon
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const salon = await Salon.findByIdAndDelete(id);

        if (!salon) {
            return NextResponse.json({ message: 'Salon not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Salon deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting salon:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
