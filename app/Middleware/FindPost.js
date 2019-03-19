'use strict'

const Post = use('App/Models/Post')
const HelperService = use('App/Services/HelperService')

class FindPost {
  async handle ({ request, response, params, auth }, next) {
    const user = request.post().adminUser ? request.post().adminUser : auth.user
    const userAccountType = request.post().userAccountType || user.account_type
    let post

    if (params.id) {
      await HelperService.validateInput(Post.rules.find, parseInt(params.id), Post.mesages)
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
