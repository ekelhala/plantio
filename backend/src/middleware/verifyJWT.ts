import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const verify = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['jwt']
    const userData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      name: userData['name'],
      email: userData['email'],
      id: userData['id'],
    }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid access token' })
  }
}