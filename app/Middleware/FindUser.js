'use strict'

const User = use('App/Models/User')
const HelperService = use('App/Services/HelperService')

class FindUser {
  async handle ({ request, params }, next) {
    await HelperService.validateInput(User.rules.find, parseInt(params.id), User.messages)

    const user = await User.find(params.id);
    HelperService.handleResourceNotExist(user, 'user does not exist or has been previously deleted')

    request.body.user = user

    await next()
  }
}

module.exports = FindUser
