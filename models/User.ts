import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['customer', 'salon_owner', 'admin'],
        default: 'customer'
    },
    profileImage: {
        type: String,
        default: "/default-avatar.png"
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        newsletter: {
            type: Boolean,
            default: false
        }
    },
    // For salon owners
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon'
    },
    // For customers
    bookingHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    favoriteServices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;