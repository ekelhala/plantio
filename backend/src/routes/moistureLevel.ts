import { Router } from "express";
import { MoistureLevel } from "../models/MoistureLevel";

const router = Router()

router.get('/:nodeId', async(req, res) => {
    try {
        // find one moisture level associated to requested node id, sort timestamps in descending
        // order to get the latest
        const latestMoistureLevel = await MoistureLevel.findOne({nodeId: req.params.nodeId})
                                                        .sort({timestamp: -1})
        res.json(latestMoistureLevel)
    }
    catch(error) {
        console.log(error)
        res.status(400).json({error: 'Invalid node id'})
    }
})

export default router