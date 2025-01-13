import { FormEvent } from "react"
import { getById } from "../services/moistureData"

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
        <form onSubmit={(event) => getMoistureData(event)}>
            <input type="text" name="nodeId" placeholder="Node ID"/>
            <input type="submit"/>
          </form>
    )
}

export default NodeForm