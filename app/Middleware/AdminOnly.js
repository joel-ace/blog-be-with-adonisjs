'use strict'

const HelperService = use('App/Services/HelperService')

class AdminOnly {
  async handle ({ request, auth }, next) {
    const user = await auth.getUser()

    HelperService.verifyAccess(user.account_type, ['admin'])

    request.body.adminUser = user

    await next()
  }
}

module.exports = AdminOnly
