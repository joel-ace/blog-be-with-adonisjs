'use strict'

const Post = use('App/Models/Post')
const Category = use('App/Models/Category')
const HelperService = use('App/Services/HelperService')

class PostController {
  async index ({ request }) {
    const userAccountType = request.post().userAccountType

    const { page, limit, type, featured, category, status } = request.get()

    return await Post.query()
      .listPost(userAccountType, type, featured, category, status)
      .paginate(parseInt(page) || 1, parseInt(limit) || 20)
  }

  async store ({ request }) {
    const user = request.post().adminUser

    const { title, body, type, category_id, featured_image, featured, status, tags } = request.all()

    await HelperService.validateInput(Post.rules.store, request.all(), Post.messages)

    const post = new Post()

    const category = await Category.find(category_id)
    HelperService.handleResourceNotExist(category, 'category_id provided does not exist or has been previously deleted')

    post.title = title || post.title
    post.body = body || post.body
    post.type = type || post.type
    post.category_id = category.id || post.category_id
    post.featured_image = featured_image || post.featured_image
    post.featured = featured || post.featured
    post.status = status || post.status

    await user.posts().save(post)

    if (tags && tags.length > 0) {
      await post.tags().attach(tags)
      post.tags = await post.tags().fetch()
    }

    return { post }
  }

  async show ({ request }) {
    const post = request.post().post

    return post
  }

  async update ({ request, response }) {
    const post = request.post().post
    const user = request.post().adminUser

    const { title, body, category_id, featured_image, featured, status, tags } = request.all()

    await HelperService.validateInput(Post.rules.update, request.all(), Post.messages)

    const category = await Category.find(category_id || post.category_id)
    HelperService.handleResourceNotExist(category, 'category_id provided does not exist or has been previously deleted')

    post.title = title || post.title
    post.body = body || post.body
    post.category_id = category.id || post.category_id
    post.featured_image = featured_image || post.featured_image
    post.featured = featured || post.featured
    post.status = status || post.status
    post.last_modified_by = user.id || post.last_modified_by

    await post.save(post)

    if (tags && tags.length > 0) {
      await post.tags().detach()
      await post.tags().attach(tags)
      post.tags = await post.tags().fetch()
    }

    return { post }
  }

  async destroy ({ request }) {
    const post = request.post().post

    await post.delete();

    return {
      post,
      message: 'post deleted successfully'
    };
  }
}

module.exports = PostController
