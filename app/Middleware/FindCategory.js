'use strict'

const Category = use('App/Models/Category')
const HelperService = use('App/Services/HelperService')

class FindCategory {
  async handle ({ request, response, params }, next) {

    const validationRules = {
      id: 'required|integer',
    }

    await HelperService.validateInput(validationRules, parseInt(params.id), response)

    const category = await Category.find(params.id);
    HelperService.handleResourceNotExist(category, 'category does not exist or has been previously deleted')

    request.body.category = category;

    await next()
  }
}

module.exports = FindCategory
