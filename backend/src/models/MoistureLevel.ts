import mongoose, { Schema } from "mongoose"

const moistureLevelSchema = new Schema({
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    nodeId: {
        type: String,
        required: true
    }
})

export const MoistureLevel = mongoose.model('MoistureLevel', moistureLevelSchema)