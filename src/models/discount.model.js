const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_discription: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true },
    discount_user_used: { type: Array, default: [] },
    discount_max_per_user: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
        type: String,
        enum: ["all", "specific",],
        required: true,
    },
    discount_producIds: { type: Array, default: [] },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = model(DOCUMENT_NAME, discountSchema)