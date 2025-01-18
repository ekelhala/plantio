import mongoose, { Schema } from "mongoose"

const notificationSchema = new Schema({
    percentage: Number,
    nodeId: String,
    userId: String
},
{
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
})

export const Notification = mongoose.model('Notification', notificationSchema)