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

  posts () {
    return this.belongsToMany('App/Models/Post')
  }

  setTitle (title) {
    return title.toLowerCase()
  }
}

module.exports = Tag
