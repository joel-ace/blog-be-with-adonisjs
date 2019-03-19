'use strict'

class StoreUser {
  get rules () {
    return {
      full_name: 'required',
      email: 'required|email',
      password: 'required|min:6|confirmed',
      auth_type: 'in:facebook,twitter',
    }
  }

  get messages () {
    return {
      'email.required': 'email address is required',
      'email.email': 'please enter a valid email address',
      'email.unique': 'a user with this email already exists',
      'username.required': 'username is required',
      'username.unique': 'a user with this username already exists',
      'phone.required': 'phone number is required',
      'phone.integer': 'only integers are allowed as phone number',
    }
  }

}

module.exports = StoreUser
