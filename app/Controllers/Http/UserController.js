'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')
const { returnValidationErrors, verifyRegisteredUser } = use('App/Services/HelperService')



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

    returnValidationErrors(validation, response)

    const newUser = await User.findBy('email', email)
    verifyRegisteredUser(newUser, 'an account with this email already exists')

    const user = await User.create({
      email,
      full_name,
      password,
      strategy,
      username: email,
    });

    return user;
  }

}

module.exports = UserController
