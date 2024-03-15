import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface DecodedToken {
    client_id: string
}

export default function getClientId(authToken: string) {
    if (authToken) {
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.decode(token) as DecodedToken;
    
        return decodedToken?.client_id;
    }
    return uuidv4();
}