'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ResourceExistsException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    return response.status(409).json({
      message: error.message
    })
  }
}

module.exports = ResourceExistsException
