import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { Notification } from "../types/Notification"
import { deleteNotification } from "../services/notifications"
import { Delete, Notifications } from "@mui/icons-material"

interface NotificationListDialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    notifications: Notification[]|null
    setUpdateNotifications: React.Dispatch<React.SetStateAction<boolean>>
    updateNotifications: boolean
}

const NotificationListDialog = (props: React.PropsWithoutRef<NotificationListDialogProps>) => {

    const removeNotification = async (id: string) => {
        try {
            await deleteNotification(id)
            props.setUpdateNotifications(!props.updateNotifications)
        }
        catch(error){}
    }

    return(
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}>
            <DialogContent>
                <List sx={{
                    width: '100%'
                }}>
                    <DialogTitle>Aktiiviset muistutukset</DialogTitle>
                    {props.notifications ? 
                        props.notifications.map(notification => 
                        <ListItem key={notification.id}
                            secondaryAction={
                                <IconButton edge='end' onClick={() => removeNotification(notification.id)}>
                                    <Delete/>
                                </IconButton>
                            }>
                            <ListItemAvatar>
                                <Notifications/>
                            </ListItemAvatar>
                            <ListItemText primary={notification.nodeId} secondary={`alle ${notification.percentage}%`}/>
                        </ListItem>) : null}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)}>Sulje</Button>
            </DialogActions>
        </Dialog>
    )
}

export default NotificationListDialog