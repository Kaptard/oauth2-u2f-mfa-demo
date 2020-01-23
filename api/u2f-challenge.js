const Endpoint = require('cubic-api/endpoint')
const u2f = require('u2f')
const appId = 'https://studienarbeit.kaptard.io'

class U2F extends Endpoint {
  constructor(options) {
    super(options)
    this.cc = 0
  }

  async main (req, res) {
    const user = req.user.uid
    const data = await this.db.collection('oauth2').findOne({ user })

    if (!data || !data.token) return res.send('not logged in')

    const u2fData = await this.db.collection('u2f').findOne({ user })

    // register
    if (!u2fData || !u2fData.keyHandle) {
      const u2fRequest = u2f.request(appId)
      await this.db.collection('u2f').updateOne({ user }, { $set: { challenge: u2fRequest } }, { upsert: true })
      return res.send({ type: 'register', request: u2fRequest })
    }

    // regular
    else {
      const u2fRequest = u2f.request(appId, u2fData.keyHandle)
      await this.db.collection('u2f').updateOne({ user }, { $set: { challenge: u2fRequest } })
      return res.send({ type: 'regular', request: u2fRequest })
    }
  }
}

module.exports = U2F
