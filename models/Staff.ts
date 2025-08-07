import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    speciality: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    workingHours: {
        monday: { available: Boolean, start: String, end: String },
        tuesday: { available: Boolean, start: String, end: String },
        wednesday: { available: Boolean, start: String, end: String },
        thursday: { available: Boolean, start: String, end: String },
        friday: { available: Boolean, start: String, end: String },
        saturday: { available: Boolean, start: String, end: String },
        sunday: { available: Boolean, start: String, end: String }
    }
}, {
    timestamps: true
});

const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);
export default Staff;