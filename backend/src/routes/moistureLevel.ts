import { Router } from "express";
import { MoistureLevel } from "../models/MoistureLevel";

const router = Router()

router.get('/:nodeId', async(req, res) => {
    try {
        const latestMoistureLevel = await MoistureLevel.aggregate([
                {$match: {nodeId: req.params.nodeId}},
                {$sort: {createdAt: -1}},
                {$limit: 1}
            ])
        res.json(latestMoistureLevel)
    }
    catch(error) {
        res.status(400).json({error: 'Invalid node id'})
    }
})

export default router