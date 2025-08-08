import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'
import Salon from '../../../models/Salon'
import Booking from '../../../models/Booking'
import mongoose from 'mongoose'

export async function GET() {
    try {
        await connectToDatabase()

        // Date boundaries for filtering bookings
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())

        // Step 1: Fetch all salons with populated references
        const salons = await Salon.find({})
            .populate('staff', 'name speciality status')          // populate staff fields
            .populate('servicesList', 'name price duration category') // populate services
            .populate('bookings', 'customerName bookingDate status')  // populate bookings basic info
            .lean() // convert to plain objects for modification

        const salonIds = salons.map((salon) => salon._id)

        // Step 2: Aggregate booking stats per salon using MongoDB aggregation

        // Aggregate total bookings (confirmed or completed)
        const totalBookingsMap = await aggregateBookingCount(salonIds, { status: { $in: ['confirmed', 'completed'] } })

        // Aggregate today's bookings (confirmed or pending)
        const todayBookingsMap = await aggregateBookingCount(salonIds, {
            bookingDate: { $gte: today, $lt: tomorrow },
            status: { $in: ['confirmed', 'pending'] }
        })

        // Aggregate monthly revenue (sum of price of completed bookings this month)
        const monthlyRevenueMap = await aggregateBookingRevenue(salonIds, {
            bookingDate: { $gte: startOfMonth },
            status: 'completed'
        })

        // Aggregate weekly revenue (sum of price of completed bookings this week)
        const totalRevenueMap = await aggregateBookingRevenue(salonIds, {
            bookingDate: { $gte: startOfWeek },
            status: 'completed'
        })

        // Step 3: Merge aggregated stats into each salon object
        const salonsWithStats = salons.map((salon) => {
            const idStr = salon._id.toString()
            return {
                ...salon,
                totalBookings: totalBookingsMap[idStr] || 0,
                todayBookings: todayBookingsMap[idStr] || 0,
                monthlyRevenue: `₹${(monthlyRevenueMap[idStr] || 0).toLocaleString()}`,
                totalRevenue: `₹${(totalRevenueMap[idStr] || 0).toLocaleString()}`
            }
        })

        return NextResponse.json(salonsWithStats, { status: 200 })
    } catch (error) {
        console.error('Error fetching salons with stats:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}

// Helper: aggregate booking counts per salon
async function aggregateBookingCount(salonIds: mongoose.Types.ObjectId[], matchFilter: object) {
    const pipeline = [
        { $match: { salonId: { $in: salonIds }, ...matchFilter } },
        {
            $group: {
                _id: '$salonId',
                count: { $sum: 1 }
            }
        }
    ]
    const results = await Booking.aggregate(pipeline)
    // Map salonId string to count
    return results.reduce((acc, cur) => {
        acc[cur._id.toString()] = cur.count
        return acc
    }, {} as Record<string, number>)
}

// Helper: aggregate booking revenue (sum of service prices) per salon
async function aggregateBookingRevenue(salonIds: mongoose.Types.ObjectId[], matchFilter: object) {
    const pipeline = [
        { $match: { salonId: { $in: salonIds }, ...matchFilter } },
        {
            $lookup: {
                from: 'services',          // collection name in MongoDB (ensure this matches your Service model collection)
                localField: 'serviceId',
                foreignField: '_id',
                as: 'service'
            }
        },
        { $unwind: '$service' },
        {
            $group: {
                _id: '$salonId',
                totalRevenue: { $sum: '$service.price' }
            }
        }
    ]
    const results = await Booking.aggregate(pipeline)
    // Map salonId string to revenue number
    return results.reduce((acc, cur) => {
        acc[cur._id.toString()] = cur.totalRevenue
        return acc
    }, {} as Record<string, number>)
}
