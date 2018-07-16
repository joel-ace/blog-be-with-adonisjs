'use strict'

const Category = use('App/Models/Category')
const HelperService = use('App/Services/HelperService')

class CategoryController {
  async index() {
    const categories = await Category.all()

    return { categories }
  }

  async store ({ request, response }) {
    const { title, description } = request.all()

    const validationRules = {
      title: 'required|min:3',
    }

    await HelperService.validateInput(validationRules, request.all(), response)

    const newCategory = await Category.findBy('title', title)
    HelperService.resourceExists(newCategory, 'a category with this title already exists')

    const category = await Category.create({ title, description})
    return { category }
  }

  async update ({ request, response }) {
    const validationRules = {
      title: 'required|min:3',
    }

    await HelperService.validateInput(validationRules, request.all(), response)

    const title = request.only('title')

    const newCategory = await Category.findBy('title', title)
    HelperService.resourceExists(newCategory, 'a category with this title already exists')

    const category = request.post().category

    category.merge(request.only(['title', 'description']))
    await category.save()

    return {
      category,
      message: 'category successfully updated',
    }
  }

  async destroy ({ request }) {
    const category = request.post().category

    await category.delete();

    return {
      category,
      message: 'category deleted successfully'
    };
  }
}

module.exports = CategoryController
