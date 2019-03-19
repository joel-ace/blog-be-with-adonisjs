'use strict'

const User = use('App/Models/User')
const HelperService = use('App/Services/HelperService')

class IsAdminOrUserOwn {
  async handle ({ request, auth, params }, next) {
    await HelperService.validateInput(User.rules.find, parseInt(params.id), User.messages)

    const currentUser = await auth.getUser();
    const user = await User.find(params.id);

    HelperService.verifyUserPermission(user, currentUser, 'user does not exist or has been previously deleted')

    request.body.user = user
    request.body.currentUser = currentUser

    await next()
  }
}

module.exports = IsAdminOrUserOwn
