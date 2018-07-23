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

  comments () {
    return this.hasMany('App/Models/Comment')
  }

  tags () {
    return this.belongsToMany('App/Models/Tag')
  }

  static scopeListPost (query, userAccountType) {
    if (userAccountType !== 'admin') {
      query.where('status', '=', 1)
    }
    return query
      .with('user', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .with('category', (builder) => {
        builder.select(['id', 'title', 'slug'])
      })
      .withCount('comments as total_comments')
  }

  static scopeShowPostByIdOrSlug (query, userAccountType, column, value) {
    if (userAccountType !== 'admin') {
      query.where('status', '=', 1)
    }
    return query
      .where(column, '=', value)
      .with('user', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .with('category', (builder) => {
        builder.select(['id', 'title', 'slug'])
      })
      .withCount('comments as total_comments')
  }
}

module.exports = Post
