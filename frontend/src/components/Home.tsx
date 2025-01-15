import { FormEvent, useEffect, useState } from "react"
import User from "../types/User"
import { getNodes } from "../services/nodes"
import { AppBar, Avatar, IconButton, Menu, MenuItem, Toolbar } from "@mui/material"

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
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
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
                    </div>
                </Toolbar>
            </AppBar>
            
            {nodeInfos ? nodeInfos.map(nodeInfo => {
                return (
                <div>
                    <p>{nodeInfo.nodeId}</p>
                    <p>{nodeInfo.value}</p>
                </div>
            )
            }) : <></>}
        </>
    )
}

export default Home