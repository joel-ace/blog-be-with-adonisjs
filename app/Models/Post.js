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

  static get rules () {
    return {
      store: {
        title: 'required|min:3',
        body: 'required',
        type: 'required|in:page,post',
        featured: 'integer|under:2',
        category_id: 'integer',
        status: 'integer|under:2',
      },
      find :{
        id: 'required|integer',
      },
      update: {
        title: 'required|min:3',
        body: 'required',
        featured: 'integer|under:2',
        category_id: 'integer',
        status: 'integer|under:2',
      }
    }
  }

  static get messages () {
    return {
      'title.required': 'title is required',
      'title.min': 'title should be a minimum of {{argument.0}} characters long',
      'body.required': 'body is required',
      'type.required': 'type is required',
      'type.in': 'type should be one of {{argument}}',
      'featured.under': 'featured must be less than {{argument.0}}',
      'featured.integer': 'featured must be an integer',
      'category_id.integer': 'category id must be an integer',
      'status.integer': 'status is required',
      'status.under': 'status must be less than {{argument.0}}',
    }
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
