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

    const category = await Category.create({ title, description})
    return { category }
  }

  async update () {
  }

  async destroy ({ params }) {
    const category = await Category.find(params.id);

    HelperService.handleResourceNotExist(category, 'category does not exist or has been previously deleted')

    await category.delete();

    return {
      category,
      message: 'category deleted successfully'
    };
  }
}

module.exports = CategoryController
