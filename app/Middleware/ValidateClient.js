'use strict'

class ValidateClient {
  async handle ({ request, response }, next) {
    // call next to advance the request

    const clientApp = request.header('afrodophile-client')

    if (clientApp && ['ah-web-client'].includes(clientApp)) {
      await next()
    }

    return response.status(400).json({
      message: 'the client sending this request cannot be recognized'
    })
  }
}

module.exports = ValidateClient
