'use strict'

const Model = use('Model')

class Tag extends Model {
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
      },
      find: {
        id: 'required|integer',
      }
    }
  }

  static get messages () {
    return {
      'title.required': 'tag title is required',
      'title.min': 'tag title should be a minimum of {{argument.0}} characters long',
      'id.required': 'tag id is required',
      'id.integer': 'tag id must be an integer',
    }
  }

  posts () {
    return this.belongsToMany('App/Models/Post')
  }

  setTitle (title) {
    return title.toLowerCase()
  }
}

module.exports = Tag
