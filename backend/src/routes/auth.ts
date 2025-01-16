import Router from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { verify } from '../middleware/verifyJWT'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ password: hashedPassword, email, name })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Bad request' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (bcrypt.compareSync(password, user.password))
      res
        .status(200)
        .cookie(
          'jwt',
          jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
          ),
          {
            maxAge: 60 * 60 * 1000,
          },
        )
        .json(user)
    else res.status(400).json({ error: 'Invalid credentials' })
  } catch (error) {
    res.status(400).json({ error: 'Invalid credentials' })
  }
})

router.get('/whoami', verify, async (req, res) => {
  res.json(req.user)
})

router.post('/logout', verify, async (req, res) => {
  if(req.cookies['jwt']) res.clearCookie('jwt', {path: '/', secure: true, partitioned: true, sameSite: 'none'})
  res.status(200).json({ status: 'Logged out.' })
})

export default router