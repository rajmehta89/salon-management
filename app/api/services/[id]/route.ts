import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
import Salon from '@/models/Salon';

// GET - Fetch service by ID
export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const service = await Service.findById(id)
            .populate('salonId', 'name location')
            .populate('availableStaff', 'name speciality status workingHours');

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(service, { status: 200 });
    } catch (error) {
        console.error('Error fetching service:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// PUT - Update service
export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;
        const updateData = await request.json();

        const service = await Service.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(service, { status: 200 });
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// DELETE - Delete service
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        // Remove service reference from salon
        await Salon.findByIdAndUpdate(
            service.salonId,
            { $pull: { servicesList: id } }
        );

        return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}