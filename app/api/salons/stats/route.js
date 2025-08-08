// app/api/salon/stats/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '../../../../lib/mongodb';
import Booking from '../../../../models/Booking';
import Salon from '../../../../models/Salon';

// GET - Fetch salon statistics
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const salonId = searchParams.get('salonId');

        if (!salonId) {
            return NextResponse.json({ message: 'Salon ID is required' }, { status: 400 });
        }

        // Validate salonId as a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(salonId)) {
            return NextResponse.json({ message: 'Invalid Salon ID' }, { status: 400 });
        }

        await connectToDatabase();

        // Get current date ranges (midnight times)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        // Total bookings (confirmed or completed)
        const totalBookings = await Booking.countDocuments({
            salonId: salonId,
            status: { $in: ['confirmed', 'completed'] }
        });

        // Today's bookings (confirmed or pending)
        const todayBookings = await Booking.countDocuments({
            salonId: salonId,
            bookingDate: {
                $gte: today,
                $lt: tomorrow
            },
            status: { $in: ['confirmed', 'pending'] }
        });

        // Monthly revenue (sum of completed bookings' service prices)
        const monthlyBookings = await Booking.find({
            salonId: salonId,
            bookingDate: { $gte: startOfMonth },
            status: 'completed'
        }).populate('serviceId', 'price');

        const monthlyRevenue = monthlyBookings.reduce((total, booking) => {
            return total + (booking.serviceId?.price || 0);
        }, 0);

        // Weekly revenue (sum of completed bookings' service prices)
        const weeklyBookings = await Booking.find({
            salonId: salonId,
            bookingDate: { $gte: startOfWeek },
            status: 'completed'
        }).populate('serviceId', 'price');

        const weeklyRevenue = weeklyBookings.reduce((total, booking) => {
            return total + (booking.serviceId?.price || 0);
        }, 0);

        const stats = {
            totalBookings,
            todayBookings,
            monthlyRevenue: {
                amount: monthlyRevenue,
                formatted: `₹${monthlyRevenue.toLocaleString()}`
            },
            weeklyRevenue: {
                amount: weeklyRevenue,
                formatted: `₹${weeklyRevenue.toLocaleString()}`
            }
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error('Error fetching salon stats:', error.stack || error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
