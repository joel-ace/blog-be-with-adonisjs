const ValidationErrorException = use('App/Exceptions/ValidationErrorException')
const UserExistException = use('App/Exceptions/UserExistException')

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
}

module.exports = new AuthorizationService()
