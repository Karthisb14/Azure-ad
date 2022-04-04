const jwksClient = require("jwks-rsa")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const data = req.header('Authorization').replace('Bearer ', '')
        // console.log(data)
        var token = jwt.decode(data, { complete: true });
        // console.log(token)
        var header = token.header
        // console.log(header)
      
        const options = {
            algorithms:["RS256"],
            audience: token.payload.aud
        }
        // console.log(options)

        const client = jwksClient({
            jwksUri: 'https://login.microsoftonline.com/common/discovery/keys'
        })
        const key = await client.getSigningKey(header.kid)
        // console.log(key)
        const signingKey = key.getPublicKey()
        // console.log(signingKey)

        const decodedtoken = jwt.verify(data, signingKey,options)
        // console.log(decodedtoken)
        const result = {
            name: decodedtoken.name,
            email: decodedtoken.preferred_username
        }
        // console.log(result)
        req.result = result
        next()
    } catch (e) {
        res.status(400).send(e)
    }

}



module.exports = auth