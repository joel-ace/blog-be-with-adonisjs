const {hooks} = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Exception = use('Exception')

  Exception.handle('InvalidJwtToken', async (error, { response }) => {
    return response.status(403).json({
      message: 'You need a valid token to be authenticated'
    })
  })

  Exception.handle('InvalidTokenException', async (error, { response }) => {
    return response.status(400).json({
      message: 'The provided token is invalid or expired'
    })
  })

})
