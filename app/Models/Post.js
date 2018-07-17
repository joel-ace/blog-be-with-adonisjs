'use strict'

const Model = use('Model')

class Post extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:Lucid/Slugify', {
      fields: {
        slug: 'title'
      },
      strategy: 'dbIncrement',
      disableUpdates: true
    })
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  category () {
    return this.belongsTo('App/Models/Category')
  }
}

module.exports = Post
