import Router from 'express'
import { verify } from '../middleware/verifyJWT'
import { Notification } from '../models/Notification'

const router = Router()

router.post('/', verify, async (req, res) => {
    const {percentage, nodeId} = req.body
    if(!percentage || !nodeId) res.status(400).json({error: 'Node ID and percentage must be specified'})
    else {
        try {
            await Notification.create({percentage, nodeId, userId: req.user.id})
            res.status(201).json({status: 'Notification created'})
        }
        catch(error) {
            res.status(500).json({error: 'Failed to create the notification'})
        }
    }
})

router.get('/', verify, async (req, res) => {
    const allNotifications = await Notification.find({userId: req.user.id})
    res.json(allNotifications)
})

router.delete('/:id', verify, async (req, res) => {
    try {
        const notification = await Notification.find({_id: req.params.id, userId: req.user.id})
        if(!notification) res.status(404).json({error: 'Notification not found'})
        else {
            await Notification.deleteOne(notification)
            res.json({status: 'Notification deleted'})
        }
    }
    catch(error) {

    }
})

export default router