import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Salon from '@/models/Salon';

// GET - Fetch salon statistics
export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const salonId = searchParams.get('salonId');

        if (!salonId) {
            return NextResponse.json({ message: 'Salon ID is required' }, { status: 400 });
        }

        // Get current date ranges
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        // Get total bookings for this salon
        const totalBookings = await Booking.countDocuments({
            salonId: salonId,
            status: { $in: ['confirmed', 'completed'] }
        });

        // Get today's bookings
        const todayBookings = await Booking.countDocuments({
            salonId: salonId,
            bookingDate: {
                $gte: today,
                $lt: tomorrow
            },
            status: { $in: ['confirmed', 'pending'] }
        });

        // Get monthly revenue (assuming completed bookings)
        const monthlyBookings = await Booking.find({
            salonId: salonId,
            bookingDate: { $gte: startOfMonth },
            status: 'completed'
        }).populate('serviceId', 'price');

        const monthlyRevenue = monthlyBookings.reduce((total, booking) => {
            return total + (booking.serviceId?.price || 0);
        }, 0);

        // Get weekly revenue
        const weeklyBookings = await Booking.find({
            salonId: salonId,
            bookingDate: { $gte: startOfWeek },
            status: 'completed'
        }).populate('serviceId', 'price');

        const totalRevenue = weeklyBookings.reduce((total, booking) => {
            return total + (booking.serviceId?.price || 0);
        }, 0);

        const stats = {
            totalBookings,
            todayBookings,
            monthlyRevenue: `₹${monthlyRevenue.toLocaleString()}`,
            totalRevenue: `₹${totalRevenue.toLocaleString()}`
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error('Error fetching salon stats:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
