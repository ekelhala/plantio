import { FormEvent, useEffect, useState } from "react"
import User from "../types/User"
import { getNodes } from "../services/nodes"
import { AppBar, Avatar, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, TextField, Toolbar } from "@mui/material"
import { Add } from "@mui/icons-material"

interface HomeProps {
    user: User
}

interface NodeInfo {
    nodeId: string,
    value: number,
    timestamp: string
}

const Home = (props: React.PropsWithoutRef<HomeProps>) => {

    const [nodeInfos, setNodeInfos] = useState<NodeInfo[]|null>(null)
    const [addNodeDialogOpen, setAddNodeDialogOpen] = useState<boolean>(false)
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement|null>(null)

    useEffect(() => {
        const effect = async () => {
            const infos = await getNodes()
            setNodeInfos(infos)
        }
        effect()
    }, [])

    const onMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget)
    }

    return(
        <>
            <AppBar position='fixed'>
                <Toolbar>
                    <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
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
                            onClose={() => setMenuAnchor(null)}>
                            <MenuItem>Log out</MenuItem>
                        </Menu>
                        <IconButton
                            onClick={() => setAddNodeDialogOpen(true)}>
                            <Add/>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            
            {nodeInfos ? nodeInfos.map(nodeInfo => {
                return (
                <Card>
                    <CardContent>
                        <p>{nodeInfo.value}</p>
                    </CardContent>
                </Card>
            )
            }) : <></>}
            <Dialog
                open={addNodeDialogOpen}
                onClose={() => setAddNodeDialogOpen(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const formData = event.currentTarget
                      console.log(formData.nodeId.value);
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