import mongoose, { Schema } from "mongoose"

const notificationSchema = new Schema({
    percentage: Number,
    nodeId: String,
    userId: String
})

export const Notification = mongoose.model('Notification', notificationSchema)