import { useEffect, useState } from "react"
import User from "../types/User"
import { addNode, getNodes } from "../services/nodes"
import { AppBar, Avatar, Box, Button, Card, CardContent, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, TextField, Toolbar } from "@mui/material"
import { Add } from "@mui/icons-material"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"

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
            <CssBaseline/>
            <AppBar position='fixed' component='nav'>
                <Toolbar>
                    <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
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
                            <MenuItem>Log out</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Box component='main'>
            {nodeInfos ? nodeInfos.map(nodeInfo => {
                return (
                <Card>
                    <CardContent>
                        <p>{nodeInfo.nodeId}</p>
                    </CardContent>
                </Card>
            )
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
                      console.log(formData.nodeId.value);
                      await addNode(formData.nodeId.value)
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