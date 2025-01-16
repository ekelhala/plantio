import { Alert, Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material"
import User from "../types/User"
import React, { FormEvent, ReactNode, useState } from "react"
import { login, register } from "../services/auth"

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User|null>>
}

const Login = (props: React.PropsWithoutRef<LoginProps>) => {

    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [registerAlert, setRegisterAlert] = useState<ReactNode|null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const response = await login(form.email.value, form.password.value)
        if(response.status === 200)
            props.setUser(response.data)
    }

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        try {
            await register(form.email.value, form.username.value, form.password.value)
            setRegisterAlert(<Alert severity='success'>Tili luotu, seuraavaksi voit kirjautua sisään</Alert>)
        }
        catch(error) {
            setRegisterAlert(<Alert severity='error'>Tilin luonti epäonnistui</Alert>)
        }
        finally {
            setTimeout(() => {
                setRegisterAlert(null)
            }, 2000)
        }
    }

    return (
        <Box  sx={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: '1em'
        }}>
            <Typography variant='h4'>
                Kirjaudu tai rekisteröidy
            </Typography>
            <Tabs value={selectedTab} 
                onChange={(_, value: number) => setSelectedTab(value)}>
                <Tab label='Kirjaudu' id='login-tab' aria-controls='login-tabpanel'/>
                <Tab label='Rekisteröidy' id='register-tab' aria-controls='register-tabpanel'/>
            </Tabs>
            {selectedTab === 0 &&
            <div role='tabpanel' id='login-tabpanel' aria-labelledby='login-tab'>
                <form onSubmit={(event) => handleSubmit(event)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '1rem',
                        marginTop: '1rem'
                    }}>
                    <TextField name='email' placeholder='Sähköposti'/>
                    <TextField name='password' placeholder='Salasana' type='password'/>
                    <Button type='submit' variant='contained'>Kirjaudu</Button>
                </form>
            </div>}
            {selectedTab === 1 &&
            <div role='tabpanel' id='register-tabpanel' aria-labelledby='register-tab'>
                <form onSubmit={(event) => handleRegister(event)} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '1rem',
                    marginTop: '1rem',
                    marginBottom: '1rem'
                }}>
                    <TextField name='username' placeholder='Nimi' required/>
                    <TextField name='email' placeholder='Sähköposti' type='email' required/>
                    <TextField name='password' placeholder='Salasana' type='password' required/>
                    <Button type='submit' variant='contained'>Rekisteröidy</Button>
                </form>
                {registerAlert ? registerAlert : null}
            </div>}
        </Box>
    )
}

export default Login