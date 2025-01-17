import { ArrowCircleDown, ArrowCircleUp, Delete, MoreVert, NotificationAdd } from "@mui/icons-material"
import { Card, CardHeader, IconButton, Menu, MenuItem, CardContent, Box, Typography, ListItemIcon } from "@mui/material"
import { useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { removeNode, setDryValue, setWetValue } from "../services/nodes"
import NodeInfo from "../types/NodeInfo"
import "react-circular-progressbar/dist/styles.css";

interface PlantCardProps {
    setRefreshNodes: React.Dispatch<React.SetStateAction<boolean>>
    refreshNodes: boolean
    nodeInfo: NodeInfo,
    setAddNotificationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const PlantCard = (props: React.PropsWithoutRef<PlantCardProps>) => {

    const [cardMenuAnchor, setCardMenuAnchor] = useState<HTMLElement|null>(null)

    const removeCard = async (id: string) => {
            await removeNode(id)
            props.setRefreshNodes(!props.refreshNodes)
            setCardMenuAnchor(null)
    }

    const setDry = async (id: string, rawValue: number) => {
        try {
            setCardMenuAnchor(null)
            await setDryValue(id, rawValue)
            props.setRefreshNodes(!props.refreshNodes)
        }
        catch(error){}
    }

    const setWet = async (id: string, rawValue: number) => {
        try {
            setCardMenuAnchor(null)
            await setWetValue(id, rawValue)
            props.setRefreshNodes(!props.refreshNodes)
        }
        catch(error){}
    }

    const addNotification = () => {
        setCardMenuAnchor(null)
        props.setAddNotificationDialogOpen(true)
    }

    return(
        <Card variant='outlined'>
                    <CardHeader
                        action={
                            <>
                            <IconButton onClick={(e) => setCardMenuAnchor(e.currentTarget)}>
                                <MoreVert/>
                            </IconButton>
                            <Menu 
                                open={(cardMenuAnchor!==null)}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'left',
                                  }}
                                  anchorEl={cardMenuAnchor}
                                  onClose={() => setCardMenuAnchor(null)}>
                                <MenuItem onClick={() => setWet(props.nodeInfo.nodeId, props.nodeInfo.rawValue)}>
                                    <ListItemIcon>
                                        <ArrowCircleUp fontSize='small'/>
                                    </ListItemIcon>
                                    Aseta 100%
                                </MenuItem>
                                <MenuItem onClick={() => setDry(props.nodeInfo.nodeId, props.nodeInfo.rawValue)}>
                                    <ListItemIcon>
                                        <ArrowCircleDown fontSize='small'/>
                                    </ListItemIcon>
                                    Aseta 0%
                                </MenuItem>
                                <MenuItem onClick={() => addNotification()}>
                                  <ListItemIcon>
                                        <NotificationAdd fontSize='small'/>
                                  </ListItemIcon>
                                    Uusi muistutus
                                </MenuItem>
                                <MenuItem onClick={() => removeCard(props.nodeInfo.nodeId)}>
                                  <ListItemIcon>
                                    <Delete fontSize='small'/>
                                  </ListItemIcon>
                                    Poista
                                </MenuItem>
                            </Menu>
                            </>
                        }
                        title={props.nodeInfo.name}
                        />
                    <CardContent>
                    <Box sx={{
                        display: "flex",
                        alignItems: 'flex-start',
                        justifyContent: "space-between"
                    }}>
                        <Box flex='1'>
                            <Typography variant="body2" color="textSecondary">
                                Päivitetty {new Date(props.nodeInfo.timestamp).toLocaleString()}
                            </Typography>
                            <Typography variant='body2' color="textSecondary">
                                ID: <code>{props.nodeInfo.nodeId}</code>
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                width: '20%',
                                maxWidth: '100px',
                                aspectRatio: '1',
                            }}>
                            <CircularProgressbar
                            value={props.nodeInfo.value}
                            text={`${props.nodeInfo.value}%`}
                            styles={buildStyles({
                                textColor: '#4ac769',
                                pathColor: '#4ac769',
                            })}
                            />
                        </Box>
                        </Box>
                    </CardContent>
                </Card>
    )
}