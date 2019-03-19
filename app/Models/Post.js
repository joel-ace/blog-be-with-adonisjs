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

  lastModifiedBy () {
    return this.belongsTo('App/Models/User', 'last_modified_by', 'id')
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

  static scopeListPost (query, userAccountType, type, featured, category, status) {
    if (userAccountType !== 'admin') {
      query.where('status', '=', 1)
    }
    if (category) {
      query.where('category_id', (builder) => {
        builder.select(['id'])
        .from('categories')
        .where('slug', '=', category)
      })
    }
    if (type) {
      query.where('type', '=', type)
    }
    if (featured) {
      query.where('featured', '=', featured)
    }
    if (status) {
      query.where('status', '=', status)
    }

    return query
      .setHidden(['user_id', 'category_id', 'last_modified_by'])
      .with('user', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .with('category', (builder) => {
        builder.select(['id', 'title', 'slug'])
      })
      .with('lastModifiedBy', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .withCount('comments as total_comments')
  }

  static scopeShowPostByIdOrSlug (query, userAccountType, column, value) {
    if (userAccountType !== 'admin') {
      query.where('status', '=', 1)
    }
    return query
      .setHidden(['user_id', 'category_id', 'last_modified_by'])
      .where(column, '=', value)
      .with('user', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .with('category', (builder) => {
        builder.select(['id', 'title', 'slug'])
      })
      .with('lastModifiedBy', (builder) => {
        builder.select(['id', 'full_name'])
      })
      .with('tags', (builder) => {
        builder.select(['id', 'title', 'slug'])
      })
      .with('lastModifiedBy')
      .withCount('comments as total_comments')
  }
}

module.exports = Post
