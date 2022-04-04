const express = require('express')
const msal = require('@azure/msal-node');
const auth = require('./Middleware/auth')
const jwt = require('jsonwebtoken');
const request = require('request');
const { response } = require('express');

const SERVER_PORT = process.env.PORT || 3000;

// Create Express App and Routes
const app = express();

const config = {
    auth: {
        clientId: "f81e7fdb-f1aa-450a-9b93-9f966487bc79",
        authority: "https://login.microsoftonline.com/95b5b95a-c929-444c-ab84-3f782146871c",
        clientSecret: "yDL7Q~q15aGrcBTx9NSAxB7EML14MAFF__.O2"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
}

const cca = new msal.ConfidentialClientApplication(config);
// console.log(cca)
app.get('/login', async (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["api://f81e7fdb-f1aa-450a-9b93-9f966487bc79/User.Read"],
        redirectUri: "http://localhost:3000/Home",
    };

    try {
        const data = await cca.getAuthCodeUrl(authCodeUrlParameters)
        res.status(200).send(data)

    } catch (e) {
        res.send(e)

    }
});

app.get('/Home', async (req, res) => {

    try {
        // console.log(req.query.code)
        const tokenRequest = {
            code: req.query.code,
            scopes: ["api://f81e7fdb-f1aa-450a-9b93-9f966487bc79/User.Read"],
            redirectUri: "http://localhost:3000/Home",
        };
        const data = await cca.acquireTokenByCode(tokenRequest)
        console.log(data)
        res.sendStatus(200)
        
    } catch (e) {
        res.status(500).send(e)
    }
})


app.get('/page', auth,async (req, res) => {

  res.send(req.result)


})



app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}!`))