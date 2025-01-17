import { Button, CircularProgress, Dialog, DialogActions, DialogContent, List, ListItem } from "@mui/material"
import { Notification } from "../types/Notification"
import { useEffect, useState } from "react"
import { getNotifications } from "../services/notifications"

interface NotificationListDialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NotificationListDialog = (props: React.PropsWithoutRef<NotificationListDialogProps>) => {

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
    }, [])

    return(
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}>
            <DialogContent>
                <List>
                    {notifications ? notifications.map(notification => <ListItem key={notification.id}>Kun <code>{notification.nodeId}</code> on alle {notification.percentage}%</ListItem>) : 
                                        <CircularProgress/>}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)}>Sulje</Button>
            </DialogActions>
        </Dialog>
    )
}

export default NotificationListDialog