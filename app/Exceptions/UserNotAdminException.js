'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UserNotAdminException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    return response.status(403).json({
      message: 'you do not have enough permissions to access this resource'
    })
  }
}

module.exports = UserNotAdminException
