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
},
{
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
})

export const MoistureLevel = mongoose.model('MoistureLevel', moistureLevelSchema)