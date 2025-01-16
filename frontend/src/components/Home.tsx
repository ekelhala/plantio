import React, { useEffect, useState } from "react"
import User from "../types/User"
import { addNode, getNodes } from "../services/nodes"
import { AppBar, Avatar, Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, TextField, Toolbar } from "@mui/material"
import { Add, Refresh } from "@mui/icons-material"
import { PlantCard } from "./PlantCard"
import NodeInfo from "../types/NodeInfo"
import {logout} from '../services/auth'

interface HomeProps {
    user: User
    setUser: React.Dispatch<React.SetStateAction<User|null>>
}

const Home = (props: React.PropsWithoutRef<HomeProps>) => {

    const [nodeInfos, setNodeInfos] = useState<NodeInfo[]|null>(null)
    const [addNodeDialogOpen, setAddNodeDialogOpen] = useState<boolean>(false)
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement|null>(null)
    const [refreshNodes, setRefreshNodes] = useState<boolean>(false)

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

    return(
        <>
            <CssBaseline/>
            <AppBar position='fixed' component='nav'>
                <Toolbar>
                    <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                        <IconButton 
                            onClick={() => setRefreshNodes(!refreshNodes)}>
                            <Refresh/>
                        </IconButton>
                        <IconButton
                            onClick={() => setAddNodeDialogOpen(true)}>
                            <Add/>
                        </IconButton>
                        <IconButton
                            onClick={(event) => onMenuOpen(event)}>
                            <Avatar>
                                {props.user.name.charAt(0)}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchor}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'left',
                              }}
                            open={(menuAnchor !== null)}
                            onClose={() => setMenuAnchor(null)}
                            keepMounted={true}>
                            <MenuItem
                                onClick={() => handleLogout()}>
                                Log out
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Box component='main'>
            {nodeInfos ? nodeInfos.map(nodeInfo => {
                return <PlantCard key={nodeInfo.nodeId}
                        setRefreshNodes={setRefreshNodes} refreshNodes={refreshNodes} nodeInfo={nodeInfo}/>
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
                      await addNode(formData.nodeId.value)
                      setRefreshNodes(!refreshNodes)
                      setAddNodeDialogOpen(false)
                    },
                  }}
                >
                <DialogTitle>Add new node</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Input the ID of the node you want to add to your followed nodes to see its status in your Home-screen.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="nodeId"
                        label="Node ID"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddNodeDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Home