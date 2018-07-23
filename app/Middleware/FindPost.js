'use strict'

const Post = use('App/Models/Post')
const HelperService = use('App/Services/HelperService')

class FindPost {
  async handle ({ request, response, params, auth }, next) {
    const accountType = request.post().adminUser ? request.post().adminUser.account_type : auth.user.account_type
    const userAccountType = request.post().userAccountType || accountType
    let post

    if (params.id) {
      const validationRules = {
        id: 'required|integer',
      }

      await HelperService.validateInput(validationRules, parseInt(params.id), response)
      post = await Post.query().showPostByIdOrSlug(userAccountType,'id', params.id).first()
    } else {
      post = await Post.query().showPostByIdOrSlug(userAccountType,'slug', params.slug).first()
    }

    HelperService.handleResourceNotExist(post, 'post does not exist or has been unpublished or deleted')

    request.body.post = post;

    await next()
  }
}

module.exports = FindPost
