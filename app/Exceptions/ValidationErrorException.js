'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ValidationErrorException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    return response.status(400).json(error.message);
  }
}

module.exports = ValidationErrorException
