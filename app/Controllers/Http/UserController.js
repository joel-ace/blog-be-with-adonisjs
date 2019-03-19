'use strict'

const User = use('App/Models/User')
const Persona = use('Persona')
const querystring = use('querystring');

const HelperService = use('App/Services/HelperService')

class UserController {
  async index({ request }) {
    const page = parseInt(request.get().page)
    const limit = parseInt(request.get().limit)

    const users = await User.query().paginate(page || 1, limit || 20)

    return users
  }

  async store({ request }) {
    const { email, full_name, password, password_confirmation, auth_type } = request.all()

    const strategy = auth_type ? auth_type : 'local'
    await HelperService.validateInput(User.rules.store, request.all(), User.messages)

    const newUser = await User.findBy('email', email.toLowerCase())
    HelperService.resourceExists(newUser, 'an account with this email already exists')

    await Persona.register({
      email,
      full_name,
      password,
      strategy,
      password_confirmation,
      username: email,
    })

    return this.login(...arguments)
  }

  async verifyEmail ({ params }) {
    await HelperService.validateInput(User.rules.token, params, User.messages)

    const user = await Persona.verifyEmail(querystring.unescape(params.token))
    return user
  }

  async login({ request, auth }) {
    await HelperService.validateInput(User.rules.login, request.only(['email', 'password']), User.messages)

    const { email, password } = request.all()
    const token = await auth.attempt(email, password)

    return token
  }

  async show({ request }) {
    const user = request.post().user

    return { user }
  }

  async update({ request }) {
    const payload = request.only(['full_name', 'email'])

    await HelperService.validateInput(User.rules.update, payload, User.messages)

    const user = request.post().user

    if (payload.email) {
        const verifyEmailUser = await User.findBy('email', payload.email.toLowerCase())
        HelperService.resourceExists(verifyEmailUser, 'an account with this email already exists')
    }

    await Persona.updateProfile(user, payload)

    return { user }
  }

  async updatePassword ({ request, auth, params }) {
    const payload = request.only(['old_password', 'password', 'password_confirmation'])
    const currentUser = await auth.getUser()

    await HelperService.validateInput(User.rules.updatePassword, payload, User.messages)

    const user = await User.find(params.id);

    HelperService.handleResourceNotExist(user, 'user does not exist or has been previously deleted')
    HelperService.verifyUserOwn(user.id, currentUser.id)

    await Persona.updatePassword(user, payload)

    return { user }
  }

  async forgotPassword ({ request }) {
    const { email } = request.only('email')
    await HelperService.validateInput(User.rules.forgotPassword, email, User.messages)

    const verifyEmailUser = await User.findBy('email', email.toLowerCase())

    HelperService.handleResourceNotExist(verifyEmailUser, 'we can\'t find any user with this email address')

    await Persona.forgotPassword(email)

    return { message: 'request to reset password successful' }
  }

  async updatePasswordByToken ({ request, params }) {
    const token = querystring.unescape(params.token)
    const payload = request.only(['password', 'password_confirmation'])

    await HelperService.validateInput(User.rules.updatePasswordByToken, payload, User.messages)

    await Persona.updatePasswordByToken(token, payload)

    return { message: 'password reset was successful' }
  }

  async destroy({ request }) {
    const user = request.post().user

    await user.delete();

    return {
      user,
      message: 'user deleted successfully'
    }
  }



}

module.exports = UserController
