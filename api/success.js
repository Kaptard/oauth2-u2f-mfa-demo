const Endpoint = require('cubic-api/endpoint')

class Success extends Endpoint {
  constructor(options) {
    super(options)
    this.cc = 0
  }

  async main (req, res) {
    const user = req.user.uid
    this.publish({ user })
    res.send('ok')
  }
}

module.exports = Success
