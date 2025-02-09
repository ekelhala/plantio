import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, TextField } from "@mui/material"
import { createNotification } from "../services/notifications"

interface AddNotificationDialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    nodeId: string
}

export const AddNotificationDialog = (props: React.PropsWithoutRef<AddNotificationDialogProps>) => {
    return(
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            PaperProps={{
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault()
                    const form = event.currentTarget
                    try {
                        await createNotification(props.nodeId, Number(form.percentage.value))
                    }
                    catch(error){}
                    finally {
                        form.reset()
                        props.setOpen(false)
                    }
                }
            }}>
                <DialogTitle>Lisää muistutus</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sähköpostimuistutus lähetetään, kun kosteusprosentti alittaa asetetun rajan.
                    </DialogContentText>
                    <TextField
                        type='number'
                        label='Kosteus'
                        name='percentage'
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            htmlInput: {
                                type: 'number',
                                min: 0,
                                max: 100
                            },
                            input: {
                                inputMode: 'numeric',
                                endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                                "aria-valuemax": 100,
                                "aria-valuemin": 0
                            }
                        }}
                        sx={{
                            marginTop: '1rem'
                        }}
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpen(false)}>Peruuta</Button>
                    <Button type='submit'>Aseta</Button>
                </DialogActions>
        </Dialog>
    )
}