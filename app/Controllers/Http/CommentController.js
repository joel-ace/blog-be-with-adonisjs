'use strict'

const HelperService = use('App/Services/HelperService')
const Comment = use('App/Models/Comment')

class CommentController {
  async index () {
  }

  async store ({ request, response, auth }) {
    const { comment } = request.only('comment')
    const user = auth.user
    const post = request.post().post

    const validationRules = {
      comment: 'required|max:500',
    }

    await HelperService.validateInput(validationRules, comment, response)

    const newComment = new Comment()
    newComment.user_id = user.id
    newComment.comment = comment

    await newComment.post().associate(post)

    return newComment
  }

  async destroy () {

  }
}

module.exports = CommentController
