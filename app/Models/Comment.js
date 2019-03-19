'use strict'

const Model = use('Model')

class Comment extends Model {

  static get rules () {
    return {
      store: {
        comment: 'required|max:500|min:4',
      },
      find: {
        id: 'required|integer',
      }
    }
  }

  static get messages () {
    return {
      'comment.required': 'comment is required',
      'comment.max': 'comment should be a maximum of {{argument.0}} characters long',
      'comment.min': 'comment should be a minimum of {{argument.0}} characters long',
      'id.required': 'comment id is required',
      'id.integer': 'comment id must be an integer',

    }
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  static scopeGetSingleComment (query, userAccountType, value) {
    if (userAccountType !== 'admin') {
      query.where('status', '=', 1)
    }
    return query
      .where('id', '=', value)
  }


}

module.exports = Comment
