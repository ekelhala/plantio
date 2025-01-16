import { useEffect, useState } from "react"
import PlantViewer from "./components/PlantViewer"
import {getById} from './services/moistureData'
import NodeForm from "./components/NodeForm"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import User from "./types/User"
import { getUser } from "./services/auth"
import Home from "./components/Home"
import Login from "./components/Login"

interface MoistureLevelData {
  nodeId: string,
  value: number,
  timestamp: string
}

function App() {

  const [moistureLevelData, setMoistureLevelData] = useState<MoistureLevelData|null>(null)
  const [user, setUser] = useState<User|null>(null)

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

  useEffect(() => {
    const effect = async () => {
      try {
        const response = await getUser()
        setUser(response.data)
      }
      catch(error) {}
    }
    effect()
  }, [])

  const updateMoistureLevelData = async () => {
    if(moistureLevelData) {
      const data = (await getById(moistureLevelData.nodeId)).data
      setMoistureLevelData(data)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {user ? <Home user={user} setUser={setUser}/> : <Login setUser={setUser}/>}
    </ThemeProvider>
  )
}

export default App
