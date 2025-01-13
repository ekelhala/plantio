import { FormEvent } from "react"
import { getById } from "../services/moistureData"
import './NodeForm.css'
import { Button, TextField } from "@mui/material"

interface NodeFormProps {
    setMoistureLevelData : Function
}

const NodeForm = (props: React.PropsWithoutRef<NodeFormProps>) => {

    const getMoistureData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
          const response = await getById(event.currentTarget.nodeId.value)
          if(response.status == 200)
            props.setMoistureLevelData(response.data)
        }
        catch(error) {
        }
      }

    return (
        <div className='node-form-container'>
            <form onSubmit={(event) => getMoistureData(event)} className='node-form'>
                <TextField name="nodeId" placeholder="Node ID"/>
                <Button type='submit' variant='contained'>Search</Button>
            </form>
        </div>
    )
}

export default NodeForm