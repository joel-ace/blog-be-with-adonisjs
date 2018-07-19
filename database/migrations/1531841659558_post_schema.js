'use strict'

const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('title', 255)
      table.text('body', 'longtext')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('category_id').nullable().unsigned().references('id').inTable('categories')
      table.enum('type', ['post', 'page']).defaultTo('post')
      table.string('featured_image', 70).nullable();
      table.boolean('featured').defaultTo(0).nullable();
      table.boolean('status').defaultTo(0);
      table.integer('last_modified_by').nullable();
      table.timestamp('featured_date').nullable();
      table.string('slug');
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
