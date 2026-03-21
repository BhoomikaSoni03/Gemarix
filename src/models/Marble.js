import mongoose from 'mongoose';

const MarbleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // Granite, Onyx, Quartzite
    description: { type: String, required: true },
    isChosenOne: { type: Boolean, default: false },
    model3DUrl: { type: String, required: true }, // Path to .glb
    images: [{ type: String }],
    reviews: [
        {
            name: String,
            rating: Number,
            comment: String,
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

export default mongoose.models.Marble || mongoose.model('Marble', MarbleSchema);
