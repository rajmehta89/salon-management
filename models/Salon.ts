import mongoose from 'mongoose';

const salonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: "/default-salon.png"
    },
    services: [{
        type: String,
        trim: true
    }],
    price: {
        type: String,
        trim: true
    },
    distance: {
        type: String,
        trim: true
    },
    openNow: {
        type: Boolean,
        default: true
    },
    nextSlot: {
        type: String,
        trim: true
    },
    workingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    }],
    servicesList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]
}, {
    timestamps: true
});

const Salon = mongoose.models.Salon || mongoose.model('Salon', salonSchema);
export default Salon;