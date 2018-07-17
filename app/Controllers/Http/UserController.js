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

  async store({ request, response }) {
    const { email, full_name, password, password_confirmation, auth_type } = request.all()

    const strategy = auth_type ? auth_type : 'local'

    const validationRules = {
      full_name: 'required',
      email: 'required|email',
      password: 'required|min:6|confirmed',
      auth_type: 'in:facebook,twitter',
    }

    await HelperService.validateInput(validationRules, request.all(), response)

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

  async verifyEmail ({ params, response }) {
    const validationRules = {
      token: 'required',
    }

    await HelperService.validateInput(validationRules, params, response)

    const user = await Persona.verifyEmail(querystring.unescape(params.token))
    return user
  }

  async login({ request, auth, response }) {
    const validationRules = {
      email: 'required|email',
      password: 'required|min:6',
    }

    await HelperService.validateInput(validationRules, request.only(['email', 'password']), response)

    const { email, password } = request.all()
    const token = await auth.attempt(email, password)

    return token
  }

  async show({ request }) {
    const user = request.post().user

    return { user }
  }

  async update({ request, response }) {
    const payload = request.only(['full_name', 'email'])

    const validationRules = {
      full_name: 'min:4',
      email: 'email',
    }

    await HelperService.validateInput(validationRules, payload, response)

    const user = request.post().user

    if (payload.email) {
        const verifyEmailUser = await User.findBy('email', payload.email.toLowerCase())
        HelperService.resourceExists(verifyEmailUser, 'an account with this email already exists')
    }

    await Persona.updateProfile(user, payload)

    return { user, message: 'user successfully updated'}
  }

  async updatePassword ({ request, response, auth, params }) {
    const payload = request.only(['old_password', 'password', 'password_confirmation'])
    const currentUser = await auth.getUser()

    const validationRules = {
      old_password: 'required|min:6',
      password: 'required|min:6|confirmed',
    }

    await HelperService.validateInput(validationRules, payload, response)

    const user = await User.find(params.id);

    HelperService.handleResourceNotExist(user, 'user does not exist or has been previously deleted')
    HelperService.verifyUserOwn(user.id, currentUser.id)

    const joel = await Persona.updatePassword(user, payload)

    return { user, message: 'password successfully changed'}
  }

  async forgotPassword ({ request, response }) {
    const { email } = request.only('email')

    const validationRules = {
      email: 'required|email',
    }

    await HelperService.validateInput(validationRules, email, response)

    const verifyEmailUser = await User.findBy('email', email.toLowerCase())

    if (!verifyEmailUser) {
      return response.status(404).json({
        message: 'we can\'t find any user with this email address'
      })
    }

    await Persona.forgotPassword(email)

    return { message: 'request to reset password successful' }
  }

  async updatePasswordByToken ({ request, params }) {
    const token = querystring.unescape(params.token)
    const payload = request.only(['password', 'password_confirmation'])

    const validationRules = {
      password: 'required|min:6|confirmed',
    }

    await HelperService.validateInput(validationRules, payload, response)

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
