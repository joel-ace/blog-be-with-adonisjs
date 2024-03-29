'use strict'

const Comment = use('App/Models/Comment')
const HelperService = use('App/Services/HelperService')

class FindComment {
  async handle ({ request, params, auth, response }, next) {
    const validationRules = {
      id: 'required|integer',
    }

    await HelperService.validateInput(validationRules, parseInt(params.id), response)

    const user = request.post().adminUser ? request.post().adminUser : auth.user
    const userAccountType = request.post().userAccountType || user.account_type

    const comment = await Comment.query().getSingleComment(userAccountType, params.id).first()

    HelperService.handleResourceNotExist(comment, 'comment does not exist or has been previously deleted')

    request.body.comment = comment;

    await next()
  }
}

module.exports = FindComment
