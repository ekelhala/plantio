import { Box, Button, TextField } from "@mui/material"
import User from "../types/User"
import { FormEvent } from "react"
import { login } from "../services/auth"

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User|null>>
}

const Login = (props: React.PropsWithoutRef<LoginProps>) => {

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const response = await login(form.email.value, form.password.value)
        if(response.status === 200)
            props.setUser(response.data)
    }

    return (
        <Box  sx={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1>Please login</h1>
            <form onSubmit={(event) => handleSubmit(event)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '1em'
                }}>
                <TextField name='email' placeholder='Email'/>
                <TextField name='password' placeholder='password' type='password'/>
                <Button type='submit' variant='contained'>Login</Button>
            </form>
        </Box>
    )
}

export default Login