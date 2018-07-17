'use strict'

const Model = use('Model')

class Tag extends Model {

  setTitle (title) {
    return title.toLowerCase()
  }
}

module.exports = Tag
