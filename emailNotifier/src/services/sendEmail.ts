import axios from "axios";
import { Email } from "../types/Email";

export const send = async (email: Email): Promise<boolean> => {
    try {
        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            email,
            {headers: {'api-key': process.env.BREVO_API_KEY}}
        )
        return true
    }
    catch(error) {
        return false
    }
}