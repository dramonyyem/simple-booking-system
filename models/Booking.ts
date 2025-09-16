import mongoose, { model, models, Schema } from "mongoose";

const bookingSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
},{timestamps: true})

const Booking = models.Booking || model("Booking", bookingSchema);

export default Booking;