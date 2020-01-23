const Endpoint = require('cubic-api/endpoint')

class Logout extends Endpoint {
  constructor(options) {
    super(options)
    this.cc = 0
  }

  async main (req, res) {
    const user = req.user.uid
    const token = null
    await this.db.collection('oauth2').updateOne(
      { user },
      { $set: { token } },
      { upsert: true }
    )
    await this.db.collection('u2f').updateOne(
      { user },
      { $set: { isAuthenticated: false } },
      { upsert: true }
    )
    res.send('ok')
  }
}

module.exports = Logout
