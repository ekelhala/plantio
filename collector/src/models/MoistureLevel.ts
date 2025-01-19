import mongoose, { Document, Schema } from "mongoose"

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

export interface IMoistureLevel extends Document {
    value: number,
    timestamp: Date,
    nodeId: string
}

export const MoistureLevel = mongoose.model<IMoistureLevel>('MoistureLevel', moistureLevelSchema)