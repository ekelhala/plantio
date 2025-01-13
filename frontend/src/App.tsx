import { useState } from "react"
import PlantViewer from "./components/PlantViewer"
import {getById} from './services/moistureData'
import NodeForm from "./components/NodeForm"

interface MoistureLevelData {
  nodeId: string,
  value: number,
  timestamp: string
}

function App() {

  const [moistureLevelData, setMoistureLevelData] = useState<MoistureLevelData|null>(null)

  const updateMoistureLevelData = async () => {
    if(moistureLevelData) {
      const data = (await getById(moistureLevelData.nodeId)).data
      setMoistureLevelData(data)
    }
  }

  if(moistureLevelData)
    return <PlantViewer moistureLevelData={moistureLevelData}
                        updateMoistureLevelData={updateMoistureLevelData}/>
  return <NodeForm setMoistureLevelData={setMoistureLevelData}/>
}

export default App
