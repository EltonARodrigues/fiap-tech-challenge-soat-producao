import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface DecodedToken {
    sub: string
}

export default function getClientId(authToken: string) {
    if (authToken) {
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.decode(token) as DecodedToken;
    
        return decodedToken?.sub;
    }
    return uuidv4();
}