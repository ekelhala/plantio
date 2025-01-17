import { Router } from "express"
import jwt from 'jsonwebtoken'
import { User } from "../models/User"

const router = Router()

router.get('', async (req, res) => {
    const {token} = req.query
    if(!token) res.status(400).json({error: 'Token is required'})
    else {
        try {
            const decoded = jwt.verify(token.toString(), process.env.EMAIL_VERIFICATION_SECRET)
            const user = await User.findOne({email: decoded['email'], verificationToken: token})
            if(user) {
                user.verified = true
                user.verificationToken = null
                await user.save()
                res.send('<html><p>Onneksi olkoon, tilisi on vahvistettu!</p><p>Siirry kirjautumaan <a href="https://app.multameter.com">tästä linkistä.</a></p></html>')
            }
            else res.status(400).send('<html><p>Väärä tai vanhentunut vahvistustunniste.</p></html>')
        }
        catch(error) {
            res.status(400).json({error: 'Bad request'})
        }
    }
})

export default router;