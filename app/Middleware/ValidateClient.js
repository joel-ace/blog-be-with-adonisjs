'use strict'

class ValidateClient {
  async handle ({ request, response }, next) {
    // call next to advance the request

    const acceptedClient = ['ah-web-client', 'ah-web-mobile']
    const clientApp = request.header('afrodophile-client')

    if (clientApp && acceptedClient.includes(clientApp)) {
      return await next()
    }

    return response.status(400).json({
      message: 'the client sending this request cannot be recognized'
    })
  }
}

module.exports = ValidateClient
