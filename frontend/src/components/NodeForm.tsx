import { FormEvent, useState } from "react"
import { getById } from "../services/moistureData"
import './NodeForm.css'
import { Alert, Button, Fade, TextField } from "@mui/material"

interface NodeFormProps {
    setMoistureLevelData : Function
}

const NodeForm = (props: React.PropsWithoutRef<NodeFormProps>) => {

    const [showAlert, setShowAlert] = useState<boolean>(false)

    const getMoistureData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await getById(event.currentTarget.nodeId.value)
            props.setMoistureLevelData(response.data)
        }
        catch(error) {
            setShowAlert(true)
            // auto-hide after 2s
            setTimeout(() =>{
                setShowAlert(false)
            }, 2000)
        }
      }

    return (
        <div className='node-form-container'>
            <form onSubmit={(event) => getMoistureData(event)} className='node-form'>
                <TextField name="nodeId" placeholder="Node ID"/>
                <Button type='submit' variant='contained'>Search</Button>
            </form>
            <div className='alert-container'>
                <Fade in={showAlert}>
                    <Alert severity='warning' variant='outlined'>
                        Node not found
                    </Alert>
                </Fade>
            </div>
        </div>
    )
}

export default NodeForm