import { MoreVert } from "@mui/icons-material"
import { Card, CardHeader, IconButton, Menu, MenuItem, CardContent, Box, Typography } from "@mui/material"
import { useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { removeNode } from "../services/nodes"
import NodeInfo from "../types/NodeInfo"
import "react-circular-progressbar/dist/styles.css";

interface PlantCardProps {
    setRefreshNodes: React.Dispatch<React.SetStateAction<boolean>>
    refreshNodes: boolean
    nodeInfo: NodeInfo
}

export const PlantCard = (props: React.PropsWithoutRef<PlantCardProps>) => {

    const [cardMenuAnchor, setCardMenuAnchor] = useState<HTMLElement|null>(null)

    const removeCard = async (id: string) => {
            await removeNode(id)
            props.setRefreshNodes(!props.refreshNodes)
            setCardMenuAnchor(null)
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
                                <MenuItem onClick={() => removeCard(props.nodeInfo.nodeId)}>Poista</MenuItem>
                            </Menu>
                            </>
                        }
                        title={props.nodeInfo.name}
                        />
                    <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
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