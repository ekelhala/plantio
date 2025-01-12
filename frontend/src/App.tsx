import { FormEvent, useState } from "react"
import PlantViewer from "./components/PlantViewer"
import axios from "axios"

interface MoistureLevelData {
  nodeId: string,
  value: number,
  timestamp: Date
}

function App() {

  const [moistureLevelData, setMoistureLevelData] = useState<MoistureLevelData|null>(null)

  const getMoistureData = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const data = (await axios.get(`http://127.0.0.1:8000/api/moisture_level/${event.currentTarget.nodeId.value}`)).data
      setMoistureLevelData(data)
    }
    catch(error) {
      console.log(error)
    }
  }

  return( moistureLevelData ? <PlantViewer moistureLevelData={moistureLevelData}/> : 
          <form onSubmit={(event) => getMoistureData(event)}>
            <input type="text" name="nodeId" placeholder="Node ID"/>
            <input type="submit"/>
          </form>)
}

export default App
