// app/api/bookings/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Salon from '@/models/Salon';

// GET - Fetch all bookings or filter by salon/status
export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const salonId = searchParams.get('salonId');
        const status = searchParams.get('status');

        let query = {};

        if (salonId) {
            query.salonId = salonId;
        }

        if (status === 'upcoming') {
            const today = new Date();
            query.bookingDate = { $gte: today };
            query.status = { $in: ['pending', 'confirmed'] };
        } else if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('salonId', 'name location phone')
            .populate('serviceId', 'name price duration')
            .populate('staffId', 'name speciality phone')
            .populate('customerId', 'name phone email')
            .sort({ bookingDate: 1, 'timeSlot.start': 1 });

        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// POST - Create new booking
export async function POST(request) {
    try {
        await connectToDatabase();
        const bookingData = await request.json();

        // Check for time slot conflicts
        const { salonId, staffId, bookingDate, timeSlot } = bookingData;

        const conflictingBooking = await Booking.findOne({
            salonId,
            staffId,
            bookingDate: new Date(bookingDate),
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

        const booking = new Booking(bookingData);
        await booking.save();

        // Add booking reference to salon
        if (bookingData.salonId) {
            await Salon.findByIdAndUpdate(
                bookingData.salonId,
                { $push: { bookings: booking._id } }
            );
        }

        const populatedBooking = await Booking.findById(booking._id)
            .populate('salonId', 'name location')
            .populate('serviceId', 'name price duration')
            .populate('staffId', 'name speciality');

        return NextResponse.json(populatedBooking, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}