'use strict'

const Tag = use('App/Models/Tag')
const HelperService = use('App/Services/HelperService')

class TagController {
  async index() {
    const tags = await Tag.all()

    return { tags }
  }

  async store ({ request, response }) {
    const { title } = request.all()

    const validationRules = {
      title: 'required|min:3',
    }

    await HelperService.validateInput(validationRules, request.all(), response)

    const newTag = await Tag.findBy('title', title)
    HelperService.resourceExists(newTag, 'tag already exists')

    const tag = await Tag.create({ title })
    return { tag }
  }

  async update ({ request, response }) {
    const validationRules = {
      title: 'required|min:3',
    }

    await HelperService.validateInput(validationRules, request.all(), response)

    const title = request.only('title')

    const newTag = await Tag.findBy('title', title)
    HelperService.resourceExists(newTag, 'a tag with this title already exists')

    const tag = request.post().tag

    tag.merge(request.only(['title']))
    await tag.save()

    return {
      tag,
      message: 'tag successfully updated',
    }
  }

  async destroy ({ request }) {
    const tag = request.post().tag

    await tag.delete();

    return {
      tag,
      message: 'tag deleted successfully'
    };
  }
}

module.exports = TagController
