import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String },
    marbleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Marble' },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Contacted', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
