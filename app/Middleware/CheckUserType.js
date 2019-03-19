'use strict'

class CheckUserType {
  async handle ({ request, auth }, next) {
    try{
      const user = await auth.getUser()
      request.body.userAccountType = user.account_type
    } catch (e){
      request.body.userAccountType = 'guest'
    }
    await next()
  }
}

module.exports = CheckUserType
