const Event = use('Event')
const querystring = use('querystring');

const HelperService = use('App/Services/HelperService')

Event.on('user::created', async (payload) => {
  const { user, token } = payload;
  const userToken = querystring.escape(token)

  HelperService.sendUserEmail({ user, userToken }, 'email.welcome', user.email, 'Welcome to The African Hodophile')
})

Event.on('email::changed', async (payload) => {
  const { user, oldEmail, token } = payload;
  const userToken = querystring.escape(token)

  HelperService.sendUserEmail({ user, userToken, oldEmail }, 'email.emailchange', user.email, 'Confirm your email change')
})

Event.on('password::changed', async (payload) => {
  const { user } = payload;

  HelperService.sendUserEmail(user, 'email.passwordchanged', user.email, 'Password Changed ')
})

Event.on('forgot::password', async (payload) => {
  const { user, token } = payload;
  const userToken = querystring.escape(token)

  HelperService.sendUserEmail({ user, userToken }, 'email.emailchange', user.email, 'Password Reset Request')
})

Event.on('password::recovered', async (payload) => {
  const { user } = payload;

  HelperService.sendUserEmail({ user }, 'email.passwordchanged', user.email, 'Password Changed')
})


