'use strict'

const Model = use('Model')

class Comment extends Model {
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
