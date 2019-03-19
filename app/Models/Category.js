'use strict'

const Model = use('Model')

class Category extends Model {
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
        title: 'required|min:3'
      },
      find: {
        id: 'required|integer'
      },
    }
  }

  static get messages () {
    return {
      'title.required': 'category title is required',
      'title.min': 'category title should be a minimum of {{argument.0}} characters long',
      'id.required': 'category id is required',
      'id.integer': 'category id must be an integer',
    }
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }
}

module.exports = Category
