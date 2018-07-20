'use strict'

const Post = use('App/Models/Post')
const HelperService = use('App/Services/HelperService')

class FindPost {
  async handle ({ request, response, params }, next) {
    let post
    if (params.id) {
      const validationRules = {
        id: 'required|integer',
      }

      await HelperService.validateInput(validationRules, parseInt(params.id), response)

      post = await Post.query().listPostById('id', params.id).first()
    } else {
      post = await Post.query().listPostById('slug', params.slug).first()
    }

    HelperService.handleResourceNotExist(post, 'post does not exist or has been previously deleted')

    if (!post.status) {
      return response.status(404).json({
        message: 'post does not exist or has been unpublished',
      })
    }

    request.body.post = post;

    await next()
  }
}

module.exports = FindPost
