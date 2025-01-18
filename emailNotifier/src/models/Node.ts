import mongoose, { Schema } from "mongoose"

const nodeSchema = new Schema({
    nodeId: String,
    dryValue: Number,
    wetValue: Number
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

export const Node = mongoose.model('Node', nodeSchema)