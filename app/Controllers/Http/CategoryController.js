'use strict'

const Category = use('App/Models/Category')
const HelperService = use('App/Services/HelperService')

class CategoryController {
  async index() {
    const categories = await Category.all()

    return { categories }
  }

  async store ({ request }) {
    const { title, description } = request.all()

    await HelperService.validateInput(Category.rules.store, request.all(), Category.messages)

    const newCategory = await Category.findBy('title', title)
    HelperService.resourceExists(newCategory, 'a category with this title already exists')

    const category = await Category.create({ title, description})
    return { category }
  }

  async update ({ request }) {
    await HelperService.validateInput(Category.rules.store, request.all(), Category.messages)

    const title = request.only('title')

    const newCategory = await Category.findBy('title', title)
    HelperService.resourceExists(newCategory, 'a category with this title already exists')

    const category = request.post().category

    category.merge(request.only(['title', 'description']))
    await category.save()

    return {
      category,
    }
  }

  async destroy ({ request }) {
    const category = request.post().category

    await category.delete()

    return {
      category,
    }
  }
}

module.exports = CategoryController
