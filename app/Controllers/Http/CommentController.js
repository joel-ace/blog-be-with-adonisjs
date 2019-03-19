'use strict'

const HelperService = use('App/Services/HelperService')
const Comment = use('App/Models/Comment')

class CommentController {
  async index ({ request }) {
    const post = request.post().post
    const userType = request.post().userAccountType

    const page = parseInt(request.get().page)
    const limit = parseInt(request.get().limit)

    if (userType === 'admin') {
      return await post.comments().paginate(page || 1, limit || 20)
    }
    return await post.comments().where('status', '=', 1).paginate(page || 1, limit || 20)
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

  async update({ request }) {
    const comment = request.post().comment

    const newCommentStatus = comment.status ? false : true
    comment.status = newCommentStatus

    await comment.save(comment)

    return comment
  }

  async destroy ({ request }) {
    const comment = request.post().comment

    await comment.delete();

    return {
      message: 'comment deleted successfully'
    };

  }
}

module.exports = CommentController
