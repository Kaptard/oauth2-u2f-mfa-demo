const Endpoint = require('cubic-api/endpoint')
const u2f = require('u2f')
const appId = 'stua-demo'

class U2F extends Endpoint {
  constructor(options) {
    super(options)
    this.schema.method = 'POST'
    this.schema.url = '/u2f-challenge'
    this.cc = 0
  }

  async main (req, res) {
    const user = req.user.uid
    const data = await this.db.collection('u2f').findOne({ user })
    if (!data) return res.send('not logged in')

    // register
    if (!data.publicKey) {
      const check = u2f.checkRegistration(data.challenge, req.body.registrationResponse)

      if (check.successful) {
        await this.db.collection('u2f').updateOne({ user }, {
          $set: {
             publicKey: check.publicKey,
             keyHandle: check.keyHandle
            }
          })
        return res.send('ok')
      }
      return res.send({ check })
    }

    // regular
    else {
      const check = u2f.checkSignature(data.challenge, req.body.authResponse, data.publicKey)

      if (check.successful) {
        await this.db.collection('u2f').updateOne({ user }, {
          $set: {
            isAuthenticated: true
          }
        })
        return res.send('ok')
      }
      return res.send({ check })
    }
  }
}

module.exports = U2F
