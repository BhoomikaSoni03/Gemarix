import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
    customerName:     { type: String, required: true },
    email:            { type: String, required: true },
    phone:            { type: String, default: '' },
    companyName:      { type: String, default: '' },
    interestedProduct: { type: String, default: '' },      // marble name or free text
    marbleId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Marble' },
    message:          { type: String, required: true },
    source:           { type: String, enum: ['Form', 'WhatsApp', 'Direct', 'Other'], default: 'Form' },
    status:           { type: String, enum: ['New', 'Contacted', 'Converted', 'Lost', 'Pending', 'Resolved'], default: 'New' },
    notes:            { type: String, default: '' },       // admin internal notes
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
