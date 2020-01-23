const Endpoint = require('cubic-api/endpoint')
const { google } = require('googleapis')
const { client_secret, client_id, redirect }= require('../config/google/credentials.json').web

class OAuth2 extends Endpoint {
  constructor(options) {
    super(options)
    this.schema.query = [{
      name: 'code',
      required: true
    }]
    this.cc = 0
  }
  async main (req, res) {
    const user = req.user.uid
    const code = req.query.code
    const client = new google.auth.OAuth2(client_id, client_secret, redirect)
    const data = await client.getToken(code)
    await this.db.collection('oauth2').updateOne(
      { user },
      { $set: { token: data.tokens.access_token } },
      { upsert: true }
    )
    res.redirect('/success')
  }
}

module.exports = OAuth2
