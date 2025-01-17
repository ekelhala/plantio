import Router from 'express'
import { verify } from '../middleware/verifyJWT'
import { User } from '../models/User'
import { MoistureLevel } from '../models/MoistureLevel'

const router = Router()

const INITIAL_DRY_VALUE = 65000
const INITIAL_WET_VALUE = 47000

// Adds a node to be followed to User's list of followed nodes
router.post('/', verify, async (req, res) => {
    if(req.body.nodeId) {
        const node = await MoistureLevel.findOne({nodeId: req.body.nodeId})
        if(node) {
            const user = await User.findById(req.user.id)
            if(!user.nodes.some(userNode => userNode.nodeId === node.nodeId)) {
                user.nodes.push({nodeId: req.body.nodeId,
                                 name: req.body.name,
                                 dryValue: INITIAL_DRY_VALUE,
                                 wetValue: INITIAL_WET_VALUE})
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
        const moistureInfo = await MoistureLevel.findOne({nodeId: nodeIdObj.nodeId}).sort({timestamp: -1})
        let percentage = ((moistureInfo.value - nodeIdObj.dryValue)/(nodeIdObj.wetValue - nodeIdObj.dryValue))*100
        if(percentage < 0) percentage = 0
        if(percentage > 100) percentage = 100
        return {
            rawValue: moistureInfo.value,
            timestamp: moistureInfo.timestamp,
            nodeId: moistureInfo.nodeId,
            name: nodeIdObj.name,
            value: percentage.toFixed(2)
        }
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

router.post('/:nodeId/dry-value', verify, async (req, res) => {
    try {
        const {value} = req.body
        const user = await User.findById(req.user.id)
        const node = user.nodes.find(node => node.nodeId === req.params.nodeId)
        node.dryValue = value
        await user.save()
        res.json({status: 'dryValue updated'})
    }
    catch(error) {
        res.status(400).json({error: 'Value must be specified'})
    }
})

router.post('/:nodeId/wet-value', verify, async (req, res) => {
    try {
        const {value} = req.body
        const user = await User.findById(req.user.id)
        const node = user.nodes.find(node => node.nodeId === req.params.nodeId)
        node.wetValue = value
        await user.save()
        res.json({status: 'wetValue updated'})
    }
    catch(error) {
        res.status(400).json({error: 'Value must be specified'})
    }
})

export default router