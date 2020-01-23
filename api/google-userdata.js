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
    const client = new google.auth.OAuth2(client_id, client_secret)
    const stored = await this.db.collection('oauth2').findOne({ user })

    if (!stored.token) return res.send({ error: 'nop' })
    client.setCredentials({ access_token: stored.token })
    const userData = await google.oauth2('v2').userinfo.v2.me.get({ auth: client })
    return res.send(userData.data)
  }
}

module.exports = User
