import React, { useEffect, useState } from "react"
import User from "../types/User"
import { addNode, getNodes } from "../services/nodes"
import { AppBar, Avatar, Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, ListItemIcon, Menu, MenuItem, TextField, Toolbar, Tooltip } from "@mui/material"
import { Add, Logout, Notifications, Refresh } from "@mui/icons-material"
import { PlantCard } from "./PlantCard"
import NodeInfo from "../types/NodeInfo"
import {logout} from '../services/auth'
import { AddNotificationDialog } from "./AddNotificationDialog"
import NotificationListDialog from "./NotificationListDialog"
import { getNotifications } from "../services/notifications"
import { Notification } from "../types/Notification"

interface HomeProps {
    user: User
    setUser: React.Dispatch<React.SetStateAction<User|null>>
}

const Home = (props: React.PropsWithoutRef<HomeProps>) => {

    const [nodeInfos, setNodeInfos] = useState<NodeInfo[]|null>(null)
    const [addNodeDialogOpen, setAddNodeDialogOpen] = useState<boolean>(false)
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement|null>(null)
    const [refreshNodes, setRefreshNodes] = useState<boolean>(false)
    const [addNotificationDialogOpen, setAddNotificationDialogOpen] = useState<boolean>(false)
    const [selectedNodeId, setSelectedNodeId] = useState<string>('')
    const [notificationListDialogOpen, setNotificationListDialogOpen] = useState<boolean>(false)
    const [updateNotifications, setUpdateNotifications] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<Notification[]|null>(null)

    useEffect(() => {
        const effect = async () => {
            try {
                const notifications = await getNotifications()
                setNotifications(notifications.data)
            }
            catch(error){}
        }
        effect()
    }, [updateNotifications])

    useEffect(() => {
        const effect = async () => {
            const infos = await getNodes()
            setNodeInfos(infos)
        }
        effect()
    }, [refreshNodes])

    const onMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget)
    }

    const handleLogout = async () => {
        await logout()
        props.setUser(null)
    }

    const openAddNodeDialog = () => {
        setMenuAnchor(null)
        setAddNodeDialogOpen(true)
    }

    const openNotificationsList = () => {
        setMenuAnchor(null)
        setUpdateNotifications(!updateNotifications)
        setNotificationListDialogOpen(true)
    }

    return(
        <>
            <CssBaseline/>
            <AppBar position='fixed' component='nav'>
                <Toolbar>
                    <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                        <Tooltip title='Päivitä tiedot'>
                            <IconButton 
                                onClick={() => setRefreshNodes(!refreshNodes)}>
                                <Refresh/>
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            onClick={(event) => onMenuOpen(event)}>
                            <Avatar>
                                {props.user.name.charAt(0)}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchor}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              transformOrigin={{
                                horizontal: 'right',
                                vertical: 'top'
                              }}
                            open={(menuAnchor !== null)}
                            onClose={() => setMenuAnchor(null)}
                            keepMounted={true}>
                            <MenuItem
                                onClick={() => openAddNodeDialog()}>
                                <ListItemIcon>
                                    <Add fontSize='small'/>
                                </ListItemIcon>
                                Lisää laite
                            </MenuItem>
                            <MenuItem
                                onClick={() => openNotificationsList()}>
                                <ListItemIcon>
                                    <Notifications fontSize='small'/>
                                </ListItemIcon>
                                Muistutukset
                            </MenuItem>
                            <Divider/>
                            <MenuItem
                                onClick={() => handleLogout()}>
                                <ListItemIcon>
                                    <Logout fontSize='small'/>
                                </ListItemIcon>
                                Kirjaudu ulos
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Box component='main'>
            {nodeInfos ? nodeInfos.map(nodeInfo => {
                return <PlantCard key={nodeInfo.nodeId}
                        setRefreshNodes={setRefreshNodes}
                        refreshNodes={refreshNodes}
                        nodeInfo={nodeInfo}
                        setAddNotificationDialogOpen={setAddNotificationDialogOpen}
                        setSelectedNodeId={setSelectedNodeId}/>
            }) : <></>}
            </Box>

            <Dialog
                open={addNodeDialogOpen}
                onClose={() => setAddNodeDialogOpen(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const formData = event.currentTarget
                      await addNode(formData.nodeId.value, formData.plantName.value)
                      setRefreshNodes(!refreshNodes)
                      setAddNodeDialogOpen(false)
                    },
                  }}
                >
                <DialogTitle>Lisää uusi laite</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Anna laitteen koodi, jotta voit nähdä sen tiedot sovelluksessa. Voit myös antaa sille lempinimen.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="nodeId"
                        label="Koodi"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin='dense'
                        name='plantName'
                        label='Lempinimi'
                        fullWidth
                        variant='standard'/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddNodeDialogOpen(false)}>Peruuta</Button>
                    <Button type="submit">Lisää</Button>
                </DialogActions>
            </Dialog>
            <AddNotificationDialog 
                open={addNotificationDialogOpen}
                setOpen={setAddNotificationDialogOpen}
                nodeId={selectedNodeId}/>
            <NotificationListDialog
                open={notificationListDialogOpen}
                setOpen={setNotificationListDialogOpen}
                notifications={notifications}
                setUpdateNotifications={setUpdateNotifications}
                updateNotifications={updateNotifications}
                />
        </>
    )
}

export default Home