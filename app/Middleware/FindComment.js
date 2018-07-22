'use strict'

const Comment = use('App/Models/Comment')
const HelperService = use('App/Services/HelperService')

class FindComment {
  async handle ({ request, params, response }, next) {
    const validationRules = {
      id: 'required|integer',
    }

    await HelperService.validateInput(validationRules, parseInt(params.id), response)

    const comment = await Comment.find(params.id);
    HelperService.handleResourceNotExist(comment, 'comment does not exist or has been previously deleted')

    request.body.comment = comment;

    await next()
  }
}

module.exports = FindComment
