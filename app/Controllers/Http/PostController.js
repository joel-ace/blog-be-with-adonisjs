'use strict'

const Post = use('App/Models/Post')
const Category = use('App/Models/Category')
const HelperService = use('App/Services/HelperService')

class PostController {
  async index ({ request }) {
    const userAccountType = request.post().userAccountType

    const page = parseInt(request.get().page)
    const limit = parseInt(request.get().limit)

    return await Post.query().listPost(userAccountType).paginate(page || 1, limit || 20)
  }

  async store ({ request, response }) {
    const user = request.post().adminUser

    const { title, body, type, category_id, featured_image, featured, status } = request.all()

    const validationRules = {
      title: 'required|min:3',
      body: 'required',
      type: 'required|in:page,post',
      featured: 'integer|under:2',
      category_id: 'integer',
      status: 'integer|under:2',
    }

    await HelperService.validateInput(validationRules, request.all(), response)

    const post = new Post()

    const category = await Category.find(category_id)
    HelperService.handleResourceNotExist(category, 'category_id provided does not exist or has been previously deleted')

    post.title = title
    post.body = body
    post.type = type
    post.category_id = category.id
    post.featured_image = featured_image
    post.featured = featured
    post.status = status

    await user.posts().save(post)

    return { post }
  }

  async show ({ request }) {
    const post = request.post().post

    return post
  }

  async update ({ request, response }) {
    const post = request.post().post
    const user = request.post().adminUser

    const { title, body, type, category_id, featured_image, featured, status } = request.all()

    const validationRules = {
      title: 'required|min:3',
      body: 'required',
      type: 'required|in:page,post',
      featured: 'integer|under:2',
      category_id: 'integer',
      status: 'integer|under:2',
    }

    await HelperService.validateInput(validationRules, request.all(), response)

    const category = await Category.find(category_id)
    HelperService.handleResourceNotExist(category, 'category_id provided does not exist or has been previously deleted')

    post.title = title
    post.body = body
    post.category_id = category.id
    post.featured_image = featured_image
    post.featured = featured
    post.status = status
    post.last_modified_by = user.id

    await post.save(post)

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
