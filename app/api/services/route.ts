    import { NextResponse } from 'next/server';
    import connectToDatabase from '../../../lib/mongodb';
    import Service from '../../../models/Service';
    import Salon from '../../../models/Salon';

    // GET - Fetch all services or filter by salon
    export async function GET(request) {
        try {
            await connectToDatabase();
            const { searchParams } = new URL(request.url);
            const salonId = searchParams.get('salonId');

            let query = { isActive: true };
            if (salonId) {
                query.salonId = salonId;
            }

            const services = await Service.find(query)
                .populate('salonId', 'name location')
                .populate('availableStaff', 'name speciality status');

            return NextResponse.json(services, { status: 200 });
        } catch (error) {
            console.error('Error fetching services:', error);
            return NextResponse.json({ message: 'Server error' }, { status: 500 });
        }
    }

    // POST - Create new service
    export async function POST(request) {
        try {
            await connectToDatabase();
            const serviceData = await request.json();

            const service = new Service(serviceData);
            await service.save();

            // Add service reference to salon
            if (serviceData.salonId) {
                await Salon.findByIdAndUpdate(
                    serviceData.salonId,
                    { $push: { servicesList: service._id } }
                );
            }

            return NextResponse.json(service, { status: 201 });
        } catch (error) {
            console.error('Error creating service:', error);
            return NextResponse.json({ message: 'Server error' }, { status: 500 });
        }
    }