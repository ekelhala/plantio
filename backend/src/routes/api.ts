import { Router } from "express";
import moistureLevel from './moistureLevel'

const router = Router()

router.use('/moisture_level', moistureLevel)

export default router