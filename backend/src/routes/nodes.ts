import Router from 'express'
import { verify } from '../middleware/verifyJWT'
import { User } from '../models/User'
import { MoistureLevel } from '../models/MoistureLevel'

const router = Router()

// Adds a node to be followed to User's list of followed nodes
router.post('/', verify, async (req, res) => {
    if(req.body.nodeId) {
        const node = await MoistureLevel.findOne({nodeId: req.body.nodeId})
        if(node) {
            const user = await User.findById(req.user.id)
            if(!user.nodes.some(userNode => userNode.nodeId === node.nodeId)) {
                user.nodes.push({nodeId: req.body.nodeId})
                await user.save()
                res.json({status: 'Node added'})
            }
            else {
                res.status(400).json({error: 'Node already in list'})
            }
        }
        else {
            res.status(400).json({error: 'Node not found'})
        }
    }
    else
        res.status(400).json({error: 'Node ID must be specified'})
})

// Gets the nodes and their latest readings from the User's list
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user.id)
    const nodes = user.nodes
    const response = await Promise.all(nodes.map(async nodeIdObj => {
        const node = await MoistureLevel.findOne({nodeId: nodeIdObj.nodeId}).sort({timestamp: -1})
        return node
    }))
    res.json(response)
})

router.delete('/:nodeId', verify, async (req, res) => {
    const user = await User.findById(req.user.id)
    if(req.params.nodeId && user.nodes.some(userNode => userNode.nodeId === req.params.nodeId)) {
        user.nodes.forEach((item, index) => {
            if(item.nodeId===req.params.nodeId)
                user.nodes.splice(index, 1)
        })
        await user.save()
        res.json({status: 'Node removed'})
    }
    else
        res.status(400).json({error: 'Node ID must be specified and user must have the node in their list'})
})

export default router