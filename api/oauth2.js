const Endpoint = require('cubic-api/endpoint')
const { google } = require('googleapis')
const scope = [
  'https://www.googleapis.com/auth/userinfo.profile'
]
const { client_secret, client_id, redirect } = require('../config/google/credentials.json').web

class OAuth2 extends Endpoint {
  constructor(options) {
    super(options)
    this.cc = 0
  }

  async main (req, res) {
    const user = req.user.uid
    const OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect)
    const stored = await this.db.collection('oauth2').findOne({ user })

    if (!stored || !stored.token) {
      const authUrl = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope
      })
      return res.send({ url: authUrl })
      // client recalls this endpoint
    }
    return res.send({ token: stored.token })
  }
}

module.exports = OAuth2
