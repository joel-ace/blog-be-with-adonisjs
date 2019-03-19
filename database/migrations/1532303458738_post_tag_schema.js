'use strict'

const Schema = use('Schema')

class PostTagSchema extends Schema {
  up () {
    this.create('post_tag', (table) => {
      table.increments()
      table.integer('post_id').unsigned().index('post_id').references('id').inTable('posts').onDelete('cascade')
      table.integer('tag_id').unsigned().index('tag_id').references('id').inTable('tags').onDelete('cascade')
    })
  }

  down () {
    this.drop('post_tag')
  }
}

module.exports = PostTagSchema
