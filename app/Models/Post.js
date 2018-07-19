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

  static scopeListPostAdmin (query) {
    return query
      .with('user', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .with('category', (builder) => {
        builder.select(['id', 'title', 'slug'])
      })
  }
  static scopeListPost (query) {
    return query
      .where('status', '=', 1)
      .with('user', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .with('category', (builder) => {
        builder.select(['id', 'title', 'slug'])
      })
  }
}

module.exports = Post
