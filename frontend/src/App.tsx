import { useState } from "react"
import PlantViewer from "./components/PlantViewer"
import {getById} from './services/moistureData'
import NodeForm from "./components/NodeForm"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"

interface MoistureLevelData {
  nodeId: string,
  value: number,
  timestamp: string
}

function App() {

  const [moistureLevelData, setMoistureLevelData] = useState<MoistureLevelData|null>(null)

  const theme = createTheme({
    palette: {
      primary: {
        main: '#4ac769'
      },
      secondary: {
        main: '#3b9752'
      }
    }
  })

  const updateMoistureLevelData = async () => {
    if(moistureLevelData) {
      const data = (await getById(moistureLevelData.nodeId)).data
      setMoistureLevelData(data)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {moistureLevelData ? <PlantViewer moistureLevelData={moistureLevelData}
                                        updateMoistureLevelData={updateMoistureLevelData}/> :
                           <NodeForm setMoistureLevelData={setMoistureLevelData}/>}
    </ThemeProvider>
  )
}

export default App
