'use strict'

const Tag = use('App/Models/Tag')
const HelperService = use('App/Services/HelperService')

class TagController {
  async index() {
    const tags = await Tag.all()

    return { tags }
  }

  async store ({ request }) {
    const { title } = request.all()

    await HelperService.validateInput(Tag.rules.store, request.all(), Tag.messages)

    const newTag = await Tag.findBy('title', title)
    HelperService.resourceExists(newTag, 'tag already exists')

    const tag = await Tag.create({ title })
    return { tag }
  }

  async update ({ request }) {
    await HelperService.validateInput(Tag.rules.store, request.all(), Tag.messages)

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
