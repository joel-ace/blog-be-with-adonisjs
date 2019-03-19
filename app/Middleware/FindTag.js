'use strict'

const Tag = use('App/Models/Tag')
const HelperService = use('App/Services/HelperService')

class FindTag {
  async handle ({ request, response, params }, next) {

    const validationRules = {
      id: 'required|integer',
    }

    await HelperService.validateInput(validationRules, parseInt(params.id), response)

    const tag = await Tag.find(params.id);
    HelperService.handleResourceNotExist(tag, 'tag does not exist or has been previously deleted')

    request.body.tag = tag;

    await next()
  }
}

module.exports = FindTag
