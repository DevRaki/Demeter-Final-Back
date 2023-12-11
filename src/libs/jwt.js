import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'

export function createAccessToken(payload){
    return new Promise((resolve, reject) => { 
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
<<<<<<< Updated upstream
                expiresIn: 7600, // 2 Horas = 7600 segundos
=======
                expiresIn: 7600, // 2horas = 7600 segundos
>>>>>>> Stashed changes
            },
            (err, token) => {
                if(err) reject(err);
                resolve(token)
            }
        ) 
    })
}