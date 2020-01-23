const Endpoint = require('cubic-api/endpoint')
const { google } = require('googleapis')
const { client_secret, client_id } = require('../config/google/credentials.json').web

class User extends Endpoint {
  constructor(options) {
    super(options)
    this.cc = 0
  }

  async main (req, res) {
    const user = req.user.uid
    const storedOAuth2 = await this.db.collection('oauth2').findOne({ user })
    const storedU2f = await this.db.collection('u2f').findOne({ user })
    if (!storedOAuth2.token || !storedU2f.isAuthenticated) return res.send({ error: 'nop' })

    const client = new google.auth.OAuth2(client_id, client_secret)
    client.setCredentials({ access_token: storedOAuth2.token })
    const userData = await google.oauth2('v2').userinfo.v2.me.get({ auth: client })
    return res.send(userData.data)
  }
}

module.exports = User
