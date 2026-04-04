import mongoose from 'mongoose';

const MarbleSchema = new mongoose.Schema({
    // Core
    name:         { type: String, required: true, trim: true },
    type:         { type: String, required: true },  // Granite, Onyx, Quartzite, etc.
    category:     { type: String, default: 'General' }, // Italian, Indian, Exotic, etc.
    description:  { type: String, required: true },
    // Media
    model3DUrl:   { type: String, default: '' },       // Path to .glb
    images:       [{ type: String }],
    // Technical Specs (B2B)
    origin:       { type: String, default: '' },       // Italy, Turkey, India, etc.
    finish:       { type: String, default: 'Polished' }, // Polished, Honed, Leathered
    thickness:    [{ type: String }],                  // ['16mm', '18mm', '20mm']
    availability: { type: Number, default: 0 },        // sq. ft. in stock
    // Pricing
    priceRetail:  { type: Number, default: 0 },        // per sq. ft.
    priceBulk:    { type: Number, default: 0 },        // bulk / wholesale
    // Display flags
    isFeatured:   { type: Boolean, default: false },   // shows in homepage hero
    isChosenOne:  { type: Boolean, default: false },
    // Reviews
    reviews: [
        {
            name:    String,
            rating:  Number,
            comment: String,
            date:    { type: Date, default: Date.now },
        }
    ],
}, { timestamps: true });

export default mongoose.models.Marble || mongoose.model('Marble', MarbleSchema);
