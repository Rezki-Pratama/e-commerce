const jwt = require('jsonwebtoken');
const config = require('../helper/generate');

const verification = (role) => {
    return (req, res, next) => {
        let tokenWithBearer = req.headers.authorization;
        console.log(tokenWithBearer);
        if(tokenWithBearer) {
            let token = tokenWithBearer.split(' ')[1];
            console.log('Hasil split :'+token)
            //verification JWT
            jwt.verify(token, config.secret, (error, decode) => {
                if(error) {
                    return res.status(401).send({auth:false, message: "Token tidak terdaftar !"});
                } else {
                    if(role==2) {
                        req.auth = decode;
                        next(); 
                    } else {
                        return res.status(401).send({auth:false, message: "Gagal mengautorisasi role anda !"});
                    }
                }
            });
        } else {
            return res.status(401).send({auth:false, message: "Token tidak tersedia !"}); 
        }
    }
}

module.exports = verification;