'use strict'

const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }


  static get hidden() {
    return ['password', 'username'];
  }

  static get rules () {
    return {
      store: {
        full_name: 'required',
        email: 'required|email',
        password: 'required|min:6|confirmed',
        auth_type: 'in:facebook,twitter',
      },
      find: {
        id: 'required|integer',
      },
      token: {
        token: 'required',
      },
      login: {
        email: 'required|email',
        password: 'required|min:6',
      },
      update: {
        full_name: 'min:4',
        email: 'email',
      },
      updatePassword: {
        old_password: 'required',
        password: 'required|min:6|confirmed',
      },
      forgotPassword: {
        email: 'required|email',
      },
      updatePasswordByToken: {
        password: 'required|min:6|confirmed',
      }
    }
  }

  static get messages () {
    return {
      'full_name.required': 'full_name is required',
      'email.required': 'email address is required',
      'email.email': 'enter a valid email address',
      'password.required': 'password is required',
      'password.confirmed': 'invalid password confirmation',
      'password.min': 'password should be a minimum of {{argument.0}} characters',
      'old_password.required': 'your old password is required',
      'auth_type.in': 'auth_type should be one of {{argument}}',
      'token': 'token is required',
      'id.required': 'tag id is required',
      'id.integer': 'tag id must be an integer',
    }
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  comments () {
    return this.hasMany('App/Models/Comment')
  }

  setEmail (email) {
    return email.toLowerCase()
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }

}

module.exports = User
