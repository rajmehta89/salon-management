import mongoose from 'mongoose';
import Salon from '../models/Salon.js';
import Staff from '../models/Staff.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salon_app';

// Enhanced Users Data
const usersData = [
    // Salon Owners
    {
        name: "Robert Wilson",
        email: "robert@elitehair.com",
        phone: "+1234567890",
        password: "password123",
        role: "salon_owner"
    },
    {
        name: "Maria Garcia",
        email: "maria@glamourlounge.com",
        phone: "+1234567891",
        password: "password123",
        role: "salon_owner"
    },
    {
        name: "David Kim",
        email: "david@moderncuts.com",
        phone: "+1234567892",
        password: "password123",
        role: "salon_owner"
    },
    // Customers
    {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567800",
        password: "password123",
        role: "customer"
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567801",
        password: "password123",
        role: "customer"
    },
    {
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "+1234567802",
        password: "password123",
        role: "customer"
    },
    {
        name: "Emily Davis",
        email: "emily@example.com",
        phone: "+1234567803",
        password: "password123",
        role: "customer"
    },
    {
        name: "Sarah Johnson",
        email: "sarah.customer@example.com",
        phone: "+1234567804",
        password: "password123",
        role: "customer"
    },
    {
        name: "Alex Thompson",
        email: "alex@example.com",
        phone: "+1234567805",
        password: "password123",
        role: "customer"
    },
    {
        name: "Lisa Anderson",
        email: "lisa@example.com",
        phone: "+1234567806",
        password: "password123",
        role: "customer"
    }
];

// Enhanced Salon Data
const salonsData = [
    {
        name: "Elite Hair Studio",
        location: "Downtown, City Center",
        address: "123 Main Street, Downtown, New York, NY 10001",
        phone: "+1234567700",
        email: "info@elitehair.com",
        description: "Premium salon offering cutting-edge hair services in a luxurious environment. Specializing in modern cuts, color treatments, and styling for both men and women.",
        rating: 4.8,
        reviews: 156,
        image: "/modern-hair-salon.png",
        services: ["Haircut", "Coloring", "Styling", "Treatment", "Highlights"],
        price: "₹500-2500",
        distance: "0.5 km",
        openNow: true,
        nextSlot: "2:30 PM",
        workingHours: {
            monday: { open: "09:00", close: "20:00" },
            tuesday: { open: "09:00", close: "20:00" },
            wednesday: { open: "09:00", close: "20:00" },
            thursday: { open: "09:00", close: "20:00" },
            friday: { open: "09:00", close: "21:00" },
            saturday: { open: "08:00", close: "19:00" },
            sunday: { open: "10:00", close: "18:00" }
        }
    },
    {
        name: "Glamour Lounge",
        location: "Mall Road, Sector 15",
        address: "45 Mall Road, Sector 15, Mumbai, MH 400001",
        phone: "+1234567701",
        email: "info@glamourlounge.com",
        description: "Trendy salon with modern styling techniques and a focus on contemporary fashion trends. Expert stylists with international training.",
        rating: 4.6,
        reviews: 89,
        image: "/luxury-salon-interior.png",
        services: ["Haircut", "Beard Trim", "Facial", "Massage", "Manicure"],
        price: "₹300-1800",
        distance: "1.2 km",
        openNow: true,
        nextSlot: "3:00 PM",
        workingHours: {
            monday: { open: "10:00", close: "21:00" },
            tuesday: { open: "10:00", close: "21:00" },
            wednesday: { open: "10:00", close: "21:00" },
            thursday: { open: "10:00", close: "21:00" },
            friday: { open: "10:00", close: "22:00" },
            saturday: { open: "09:00", close: "20:00" },
            sunday: { open: "10:00", close: "19:00" }
        }
    },
    {
        name: "Modern Cuts & Style",
        location: "Business District, Block A",
        address: "78 Corporate Avenue, Business District, Delhi, DL 110001",
        phone: "+1234567702",
        email: "info@moderncuts.com",
        description: "Professional salon catering to business professionals with quick, efficient, and stylish services. Specializing in executive cuts and grooming.",
        rating: 4.7,
        reviews: 124,
        image: "/professional-salon.png",
        services: ["Executive Haircut", "Beard Styling", "Hair Wash", "Quick Trim"],
        price: "₹400-1200",
        distance: "2.1 km",
        openNow: false,
        nextSlot: "9:00 AM",
        workingHours: {
            monday: { open: "08:00", close: "19:00" },
            tuesday: { open: "08:00", close: "19:00" },
            wednesday: { open: "08:00", close: "19:00" },
            thursday: { open: "08:00", close: "19:00" },
            friday: { open: "08:00", close: "20:00" },
            saturday: { open: "09:00", close: "18:00" },
            sunday: { open: "10:00", close: "16:00" }
        }
    }
];

// Enhanced Staff Data
const staffData = [
    // Elite Hair Studio Staff
    {
        name: "Sarah Johnson",
        speciality: "Hair Coloring & Highlights",
        phone: "+1234567810",
        email: "sarah@elitehair.com",
        status: "active",
        experience: "8 years",
        certifications: ["L'Oreal Color Specialist", "Balayage Expert"],
        workingHours: {
            monday: { available: true, start: "09:00", end: "18:00" },
            tuesday: { available: true, start: "09:00", end: "18:00" },
            wednesday: { available: true, start: "09:00", end: "18:00" },
            thursday: { available: true, start: "09:00", end: "18:00" },
            friday: { available: true, start: "09:00", end: "19:00" },
            saturday: { available: true, start: "08:00", end: "17:00" },
            sunday: { available: false, start: "", end: "" }
        }
    },
    {
        name: "Mike Chen",
        speciality: "Men's Cuts & Beard Styling",
        phone: "+1234567811",
        email: "mike@elitehair.com",
        status: "active",
        experience: "6 years",
        certifications: ["Master Barber", "Beard Specialist"],
        workingHours: {
            monday: { available: true, start: "10:00", end: "19:00" },
            tuesday: { available: true, start: "10:00", end: "19:00" },
            wednesday: { available: true, start: "10:00", end: "19:00" },
            thursday: { available: true, start: "10:00", end: "19:00" },
            friday: { available: true, start: "10:00", end: "20:00" },
            saturday: { available: true, start: "09:00", end: "18:00" },
            sunday: { available: true, start: "11:00", end: "17:00" }
        }
    },
    {
        name: "Emma Davis",
        speciality: "Hair Treatment & Styling",
        phone: "+1234567812",
        email: "emma@elitehair.com",
        status: "active",
        experience: "5 years",
        certifications: ["Keratin Treatment Specialist", "Wedding Stylist"],
        workingHours: {
            monday: { available: true, start: "09:00", end: "17:00" },
            tuesday: { available: true, start: "09:00", end: "17:00" },
            wednesday: { available: false, start: "", end: "" },
            thursday: { available: true, start: "09:00", end: "17:00" },
            friday: { available: true, start: "09:00", end: "18:00" },
            saturday: { available: true, start: "08:00", end: "16:00" },
            sunday: { available: true, start: "10:00", end: "16:00" }
        }
    },
    // Glamour Lounge Staff
    {
        name: "Carlos Rodriguez",
        speciality: "Creative Cuts & Color",
        phone: "+1234567813",
        email: "carlos@glamourlounge.com",
        status: "active",
        experience: "7 years",
        certifications: ["Vidal Sassoon Graduate", "Color Correction Expert"],
        workingHours: {
            monday: { available: true, start: "10:00", end: "20:00" },
            tuesday: { available: true, start: "10:00", end: "20:00" },
            wednesday: { available: true, start: "10:00", end: "20:00" },
            thursday: { available: true, start: "10:00", end: "20:00" },
            friday: { available: true, start: "10:00", end: "21:00" },
            saturday: { available: true, start: "09:00", end: "19:00" },
            sunday: { available: false, start: "", end: "" }
        }
    },
    {
        name: "Priya Sharma",
        speciality: "Bridal Styling & Makeup",
        phone: "+1234567814",
        email: "priya@glamourlounge.com",
        status: "active",
        experience: "9 years",
        certifications: ["Bridal Specialist", "MAC Makeup Artist"],
        workingHours: {
            monday: { available: false, start: "", end: "" },
            tuesday: { available: true, start: "11:00", end: "20:00" },
            wednesday: { available: true, start: "11:00", end: "20:00" },
            thursday: { available: true, start: "11:00", end: "20:00" },
            friday: { available: true, start: "11:00", end: "21:00" },
            saturday: { available: true, start: "09:00", end: "19:00" },
            sunday: { available: true, start: "10:00", end: "18:00" }
        }
    },
    // Modern Cuts Staff
    {
        name: "James Wilson",
        speciality: "Executive Cuts & Grooming",
        phone: "+1234567815",
        email: "james@moderncuts.com",
        status: "active",
        experience: "10 years",
        certifications: ["Master Barber", "Executive Grooming Specialist"],
        workingHours: {
            monday: { available: true, start: "08:00", end: "18:00" },
            tuesday: { available: true, start: "08:00", end: "18:00" },
            wednesday: { available: true, start: "08:00", end: "18:00" },
            thursday: { available: true, start: "08:00", end: "18:00" },
            friday: { available: true, start: "08:00", end: "19:00" },
            saturday: { available: true, start: "09:00", end: "17:00" },
            sunday: { available: true, start: "10:00", end: "15:00" }
        }
    }
];

// Enhanced Services Data
const servicesData = [
    // Elite Hair Studio Services
    {
        name: "Men's Premium Haircut",
        price: 600,
        duration: 45,
        description: "Professional men's haircut with consultation, wash, cut, and styling",
        category: "Haircut",
        isActive: true
    },
    {
        name: "Women's Signature Cut",
        price: 1200,
        duration: 60,
        description: "Complete women's haircut with wash, cut, blow-dry, and styling",
        category: "Haircut",
        isActive: true
    },
    {
        name: "Full Hair Coloring",
        price: 2500,
        duration: 150,
        description: "Complete hair coloring service with consultation and aftercare",
        category: "Coloring",
        isActive: true
    },
    {
        name: "Highlights & Lowlights",
        price: 3000,
        duration: 180,
        description: "Professional highlighting service with foils or balayage technique",
        category: "Coloring",
        isActive: true
    },
    {
        name: "Keratin Treatment",
        price: 4000,
        duration: 240,
        description: "Smoothing keratin treatment for frizz-free, manageable hair",
        category: "Treatment",
        isActive: true
    },
    {
        name: "Deep Conditioning Treatment",
        price: 800,
        duration: 45,
        description: "Intensive hair treatment for damaged or dry hair",
        category: "Treatment",
        isActive: true
    },
    // Glamour Lounge Services
    {
        name: "Beard Trim & Styling",
        price: 400,
        duration: 30,
        description: "Professional beard trimming and styling with hot towel treatment",
        category: "Grooming",
        isActive: true
    },
    {
        name: "Facial Treatment",
        price: 1500,
        duration: 75,
        description: "Deep cleansing facial with extraction and moisturizing",
        category: "Skincare",
        isActive: true
    },
    {
        name: "Head Massage",
        price: 600,
        duration: 30,
        description: "Relaxing head and scalp massage with essential oils",
        category: "Wellness",
        isActive: true
    },
    {
        name: "Manicure & Pedicure",
        price: 1200,
        duration: 90,
        description: "Complete nail care service with polish application",
        category: "Nail Care",
        isActive: true
    },
    // Modern Cuts Services
    {
        name: "Executive Haircut",
        price: 500,
        duration: 30,
        description: "Quick and professional haircut for business professionals",
        category: "Haircut",
        isActive: true
    },
    {
        name: "Express Beard Trim",
        price: 250,
        duration: 15,
        description: "Quick beard trimming service",
        category: "Grooming",
        isActive: true
    }
];

// Enhanced Bookings Data
const bookingsData = [
    // Today's bookings
    {
        customerName: "John Doe",
        customerPhone: "+1234567800",
        customerEmail: "john@example.com",
        bookingDate: new Date(),
        timeSlot: {
            start: "14:30",
            end: "15:15"
        },
        status: "confirmed",
        totalPrice: 600,
        notes: "Regular customer, prefers short sides",
        paymentStatus: "paid"
    },
    {
        customerName: "Jane Smith",
        customerPhone: "+1234567801",
        customerEmail: "jane@example.com",
        bookingDate: new Date(),
        timeSlot: {
            start: "15:30",
            end: "16:30"
        },
        status: "confirmed",
        totalPrice: 1200,
        notes: "First time visit, consultation needed",
        paymentStatus: "pending"
    },
    {
        customerName: "Michael Brown",
        customerPhone: "+1234567802",
        customerEmail: "michael@example.com",
        bookingDate: new Date(),
        timeSlot: {
            start: "16:45",
            end: "17:15"
        },
        status: "pending",
        totalPrice: 400,
        notes: "Beard trim only",
        paymentStatus: "pending"
    },
    // Tomorrow's bookings
    {
        customerName: "Emily Davis",
        customerPhone: "+1234567803",
        customerEmail: "emily@example.com",
        bookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "10:00",
            end: "12:30"
        },
        status: "confirmed",
        totalPrice: 2500,
        notes: "Full color change, bring reference photos",
        paymentStatus: "paid"
    },
    {
        customerName: "Sarah Johnson",
        customerPhone: "+1234567804",
        customerEmail: "sarah.customer@example.com",
        bookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "14:00",
            end: "15:15"
        },
        status: "confirmed",
        totalPrice: 800,
        notes: "Deep conditioning treatment",
        paymentStatus: "paid"
    },
    // Day after tomorrow
    {
        customerName: "Alex Thompson",
        customerPhone: "+1234567805",
        customerEmail: "alex@example.com",
        bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "11:30",
            end: "12:00"
        },
        status: "confirmed",
        totalPrice: 500,
        notes: "Executive cut, very busy schedule",
        paymentStatus: "pending"
    },
    {
        customerName: "Lisa Anderson",
        customerPhone: "+1234567806",
        customerEmail: "lisa@example.com",
        bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "15:00",
            end: "18:00"
        },
        status: "confirmed",
        totalPrice: 3000,
        notes: "Highlights for special event",
        paymentStatus: "paid"
    },
    // Past bookings (completed)
    {
        customerName: "John Doe",
        customerPhone: "+1234567800",
        customerEmail: "john@example.com",
        bookingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "14:00",
            end: "14:45"
        },
        status: "completed",
        totalPrice: 600,
        notes: "Regular monthly cut",
        paymentStatus: "paid"
    },
    {
        customerName: "Emily Davis",
        customerPhone: "+1234567803",
        customerEmail: "emily@example.com",
        bookingDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "10:30",
            end: "11:45"
        },
        status: "completed",
        totalPrice: 1500,
        notes: "Facial treatment",
        paymentStatus: "paid"
    },
    {
        customerName: "Michael Brown",
        customerPhone: "+1234567802",
        customerEmail: "michael@example.com",
        bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "16:00",
            end: "16:30"
        },
        status: "completed",
        totalPrice: 400,
        notes: "Beard styling",
        paymentStatus: "paid"
    },
    // Cancelled booking
    {
        customerName: "Alex Thompson",
        customerPhone: "+1234567805",
        customerEmail: "alex@example.com",
        bookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        timeSlot: {
            start: "13:00",
            end: "13:30"
        },
        status: "cancelled",
        totalPrice: 500,
        notes: "Client cancelled due to emergency",
        paymentStatus: "refunded"
    }
];

async function seedDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Booking.deleteMany({});
        await Service.deleteMany({});
        await Staff.deleteMany({});
        await Salon.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Cleared existing data');

        // Insert Users
        console.log('👥 Inserting users...');
        const insertedUsers = await User.insertMany(usersData);
        console.log(`✅ Inserted ${insertedUsers.length} users`);

        // Get salon owners
        const salonOwners = insertedUsers.filter(user => user.role === 'salon_owner');
        const customers = insertedUsers.filter(user => user.role === 'customer');

        // Insert Salons and link to owners
        console.log('🏢 Inserting salons...');
        const salonsToInsert = salonsData.map((salon, index) => ({
            ...salon,
            ownerId: salonOwners[index % salonOwners.length]._id
        }));
        const insertedSalons = await Salon.insertMany(salonsToInsert);
        console.log(`✅ Inserted ${insertedSalons.length} salons`);

        // Update users with salon references
        for (let i = 0; i < salonOwners.length && i < insertedSalons.length; i++) {
            await User.findByIdAndUpdate(salonOwners[i]._id, {
                salonId: insertedSalons[i]._id
            });
        }

        // Insert Staff and link to salons
        console.log('👨‍💼 Inserting staff...');
        const staffToInsert = staffData.map((staff, index) => ({
            ...staff,
            salonId: insertedSalons[Math.floor(index / 2)]._id // Distribute staff across salons
        }));
        const insertedStaff = await Staff.insertMany(staffToInsert);
        console.log(`✅ Inserted ${insertedStaff.length} staff members`);

        // Insert Services and link to salons and staff
        console.log('💇‍♀️ Inserting services...');
        const servicesToInsert = servicesData.map((service, index) => {
            const salonIndex = Math.floor(index / 4); // 4 services per salon roughly
            const salon = insertedSalons[salonIndex] || insertedSalons[0];
            const salonStaff = insertedStaff.filter(staff =>
                staff.salonId.toString() === salon._id.toString()
            );

            return {
                ...service,
                salonId: salon._id,
                availableStaff: salonStaff.length > 0 ?
                    [salonStaff[index % salonStaff.length]._id] :
                    [insertedStaff[0]._id]
            };
        });
        const insertedServices = await Service.insertMany(servicesToInsert);
        console.log(`✅ Inserted ${insertedServices.length} services`);

        // Insert Bookings
        console.log('📅 Inserting bookings...');
        const bookingsToInsert = bookingsData.map((booking, index) => {
            const salon = insertedSalons[0]; // Most bookings for first salon
            const salonStaff = insertedStaff.filter(staff =>
                staff.salonId.toString() === salon._id.toString()
            );
            const salonServices = insertedServices.filter(service =>
                service.salonId.toString() === salon._id.toString()
            );
            const customer = customers[index % customers.length];

            return {
                ...booking,
                salonId: salon._id,
                serviceId: salonServices[index % salonServices.length]._id,
                staffId: salonStaff[index % salonStaff.length]._id,
                customerId: customer._id
            };
        });
        const insertedBookings = await Booking.insertMany(bookingsToInsert);
        console.log(`✅ Inserted ${insertedBookings.length} bookings`);

        // Update salons with references
        console.log('🔗 Updating salon references...');
        for (const salon of insertedSalons) {
            const salonStaff = insertedStaff.filter(staff =>
                staff.salonId.toString() === salon._id.toString()
            );
            const salonServices = insertedServices.filter(service =>
                service.salonId.toString() === salon._id.toString()
            );
            const salonBookings = insertedBookings.filter(booking =>
                booking.salonId.toString() === salon._id.toString()
            );

            await Salon.findByIdAndUpdate(salon._id, {
                staff: salonStaff.map(s => s._id),
                servicesList: salonServices.map(s => s._id),
                bookings: salonBookings.map(b => b._id)
            });
        }

        console.log('🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${insertedUsers.length} (${salonOwners.length} owners, ${customers.length} customers)`);
        console.log(`   Salons: ${insertedSalons.length}`);
        console.log(`   Staff: ${insertedStaff.length}`);
        console.log(`   Services: ${insertedServices.length}`);
        console.log(`   Bookings: ${insertedBookings.length}`);
        console.log('\n🔑 Test Salon Owner Login:');
        console.log(`   Email: ${salonOwners[0].email}`);
        console.log(`   Password: password123`);
        console.log(`   Salon ID: ${insertedSalons[0]._id}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase().catch(console.error);
}

export default seedDatabase;
