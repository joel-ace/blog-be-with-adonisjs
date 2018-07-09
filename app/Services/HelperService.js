const ValidationErrorException = use('App/Exceptions/ValidationErrorException')
const UserExistException = use('App/Exceptions/UserExistException')
const ResourceNotExistException = use('App/Exceptions/ResourceNotExistException')
const InvalidAccessException = use('App/Exceptions/InvalidAccessException')

class AuthorizationService {
  verifyRegisteredUser(user, message) {
    if (user)  {
      throw new UserExistException(message)
    }
  }

  returnValidationErrors(validation, response) {
    if(validation.fails()) {
      throw new ValidationErrorException(validation.messages())
    }
  }

  handleResourceNotExists(resource, message) {
    if (!resource)  {
      throw new ResourceNotExistException(message)
    }
  }

  verifyUserPermission(resource, user, message) {
    this.handleResourceNotExists(resource, message)

    if (user.id !== resource.id && user.account_type !== 'admin') {
      throw new InvalidAccessException('You are not authorized to access this resource')
    }
  }
}

module.exports = new AuthorizationService()
