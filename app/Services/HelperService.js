const { validateAll } = use('Validator')
const Mail = use('Mail')
const Env = use('Env')

const ValidationErrorException = use('App/Exceptions/ValidationErrorException')
const ResourceExistsException = use('App/Exceptions/ResourceExistsException')
const ResourceNotExistException = use('App/Exceptions/ResourceNotExistException')
const InvalidAccessException = use('App/Exceptions/InvalidAccessException')
const UserNotAdminException = use('App/Exceptions/UserNotAdminException')

const appName = Env.get('APP_NAME')
const appURL = Env.get('APP_URL')

class HelperService {
  resourceExists(user, message) {
    if (user)  {
      throw new ResourceExistsException(message)
    }
  }

  handleResourceNotExist(resource, message) {
    if (!resource)  {
      throw new ResourceNotExistException(message)
    }
  }

  verifyUserOwn(resourceID, userID) {
    if (userID !== resourceID) {
      throw new InvalidAccessException('only the resource owner can access this resource')
    }
  }

  verifyUserPermission(resource, user, message) {
    this.handleResourceNotExist(resource, message)

    if (user.id !== resource.id && user.account_type !== 'admin') {
      throw new InvalidAccessException('You are not authorized to access this resource')
    }
  }

  verifyAccess(resourceLevel, authorizationLevels = ['user']) {
    if (!authorizationLevels.includes(resourceLevel))  {
      throw new UserNotAdminException()
    }
  }

  async validateInput(validationRules, validationFields, response) {
    const validation = await validateAll(validationFields, validationRules)

    if(validation.fails()) {
      throw new ValidationErrorException(validation.messages())
    }
  }

  async sendUserEmail(payload, template, to, subject,from = 'donotreply@africanhodophile.com') {
    try {
      await Mail.send(template, { ...payload, appName, appURL }, (message) => {
        message.to(to)
        message.from(from)
        message.subject(subject)
      })

    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new HelperService()
