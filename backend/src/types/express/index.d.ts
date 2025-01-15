import User from '../User'

export {}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}