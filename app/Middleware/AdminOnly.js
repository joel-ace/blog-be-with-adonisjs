'use strict'

const HelperService = use('App/Services/HelperService')

class AdminOnly {
  async handle ({ request, auth }, next) {
    const user = await auth.getUser()

    HelperService.verifyAccess(user.account_type, ['admin'])

    request.body.adminUser = user

    // call next to advance the request
    await next()
  }
}

module.exports = AdminOnly
