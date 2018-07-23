'use strict'

const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.integer('post_id').unsigned().references('id').inTable('posts')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('comment').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
