const jwt = require('jsonwebtoken')

const config = process.env

const verifyToken = (req, res, next)=>{
    const token = req.body.token || req.query.token || req.headers['x-access-token']

    if(!token){
        let response = {
            data: null,
            msg: 'Token required for authentication.',
            code: 403
        }
        return res.status(403).send(response)
    }

    try{
        const decoded = jwt.verify(token, config.TOKEN_KEY)
        req.user = decoded;
    }catch(err){
        let response = {
            data: null,
            msg: 'Invalid Token.',
            code: 401
        }
        return res.status(401).send(response)
    }

    return next();
}

module.exports = verifyToken