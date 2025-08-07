import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Salon from '@/models/Salon';

// GET - Fetch booking by ID
export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const booking = await Booking.findById(id)
            .populate('salonId', 'name location phon')
            .populate('serviceId', 'name price duration description')
            .populate('staffId', 'name speciality phone');

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking, { status: 200 });
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// PUT - Update booking
export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;
        const updateData = await request.json();

        // If updating time slot, check for conflicts
        if (updateData.timeSlot || updateData.bookingDate || updateData.staffId) {
            const currentBooking = await Booking.findById(id);
            if (!currentBooking) {
                return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
            }

            const staffId = updateData.staffId || currentBooking.staffId;
            const bookingDate = updateData.bookingDate ? new Date(updateData.bookingDate) : currentBooking.bookingDate;
            const timeSlot = updateData.timeSlot || currentBooking.timeSlot;

            // Check for conflicts (excluding current booking)
            const conflictingBooking = await Booking.findOne({
                _id: { $ne: id },
                staffId,
                bookingDate,
                status: { $in: ['pending', 'confirmed'] },
                $or: [
                    {
                        'timeSlot.start': { $lte: timeSlot.start },
                        'timeSlot.end': { $gt: timeSlot.start }
                    },
                    {
                        'timeSlot.start': { $lt: timeSlot.end },
                        'timeSlot.end': { $gte: timeSlot.end }
                    },
                    {
                        'timeSlot.start': { $gte: timeSlot.start },
                        'timeSlot.end': { $lte: timeSlot.end }
                    }
                ]
            });

            if (conflictingBooking) {
                return NextResponse.json({ message: 'Time slot not available' }, { status: 409 });
            }
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('salonId', 'name location')
            .populate('serviceId', 'name price duration')
            .populate('staffId', 'name speciality');

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking, { status: 200 });
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// DELETE - Cancel booking
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        // Remove booking reference from salon
        await Salon.findByIdAndUpdate(
            booking.salonId,
            { $pull: { bookings: id } }
        );

        return NextResponse.json({ message: 'Booking cancelled successfully', booking }, { status: 200 });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}