'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')
const HelperService = use('App/Services/HelperService')



class UserController {
  async store({ request, response }) {
    const { email, full_name, password, auth_type } = request.all()

    const strategy = auth_type ? auth_type : 'local'

    const validation = await validateAll(request.all(), {
      full_name: 'required',
      email: 'required|email',
      password: 'required|min:6',
      auth_type: 'in:facebook,twitter',
    })

    HelperService.returnValidationErrors(validation, response)

    const newUser = await User.findBy('email', email)
    HelperService.verifyRegisteredUser(newUser, 'an account with this email already exists')

    await User.create({
      email,
      full_name,
      password,
      strategy,
      username: email,
    });

    return this.login(...arguments)
  }

  async login({ request, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)

    return token
  }

  async destroy({ auth, params }) {
    const currentUser = await auth.getUser();
    const user = await User.find(params.id);

    HelperService.verifyUserPermission(user, currentUser, 'user does not exist or has been previously deleted')

    await user.delete();

    return {
      user,
      message: 'user deleted successfully'
    };
  }


}

module.exports = UserController
