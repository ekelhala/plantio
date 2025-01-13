import { FormEvent, useState } from "react"
import PlantViewer from "./components/PlantViewer"
import {getById} from './services/moistureData'

interface MoistureLevelData {
  nodeId: string,
  value: number,
  timestamp: string
}

function App() {

  const [moistureLevelData, setMoistureLevelData] = useState<MoistureLevelData|null>(null)

  const getMoistureData = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await getById(event.currentTarget.nodeId.value)
      if(response.status == 200)
        setMoistureLevelData(response.data)
    }
    catch(error) {
    }
  }

  const updateMoistureLevelData = async () => {
    if(moistureLevelData) {
      const data = (await getById(moistureLevelData.nodeId)).data
      setMoistureLevelData(data)
    }
  }

  return( moistureLevelData ? <PlantViewer moistureLevelData={moistureLevelData}
                                           updateMoistureLevelData={updateMoistureLevelData}/> : 
          <form onSubmit={(event) => getMoistureData(event)}>
            <input type="text" name="nodeId" placeholder="Node ID"/>
            <input type="submit"/>
          </form>)
}

export default App
