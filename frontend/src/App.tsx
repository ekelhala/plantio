import { useEffect, useState } from "react"
import {getById} from './services/moistureData'
import { Box, CircularProgress, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import User from "./types/User"
import { getUser } from "./services/auth"
import Home from "./components/Home"
import Login from "./components/Login"

interface MoistureLevelData {
  nodeId: string,
  value: number,
  timestamp: string
}

interface AppContentProps {
  userLoading: boolean,
  user: User|null,
  setUser: React.Dispatch<React.SetStateAction<User|null>>
}

const AppContent = (props: React.PropsWithoutRef<AppContentProps>) => {
  if(props.userLoading)
    return (
      <Box sx={{
                    position: 'fixed',
                    display: 'flex', 
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'}}>
        <CircularProgress/>
      </Box>
  )
  return(
    (props.user ? <Home user={props.user} setUser={props.setUser}/> : <Login setUser={props.setUser}/>)
  )
}

function App() {

  const [moistureLevelData, setMoistureLevelData] = useState<MoistureLevelData|null>(null)
  const [user, setUser] = useState<User|null>(null)
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true)

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
      finally {
        setTimeout(() => {
          setIsUserLoading(false)
        }, 700)
      }
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
      <AppContent userLoading={isUserLoading} user={user} setUser={setUser}/>
    </ThemeProvider>
  )
}

export default App
