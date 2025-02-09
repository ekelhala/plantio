import { Schema, model, Document } from 'mongoose'

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    nodes: [
        {
            nodeId: String,
            name: String,
        }
    ],
    verified: {
      type: Boolean,
      default: false
    },
    verificationToken: String
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
        return ret
      },
    },
  },
)

export interface IUser extends Document {
  name: string
  email: string
  password: string
  nodes: [{nodeId: string, name:string|null}]|null
  verified: boolean
  verificationToken: string|null
}

export const User = model<IUser>('User', UserSchema)