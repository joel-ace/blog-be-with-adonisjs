const Event = use('Event')
const Mail = use('Mail')

Event.on('user::created', async (payload) => {
  const { user, token } = payload;
  try {
    await Mail.raw(`Welcome ${user.full_name} to African Hodophile. to activate your accout, visit http://127.0.0.1:3333/activateacount${token}`, (message) => {
      message.subject('Hello African Hodophile')
      message.from('African Hodophile')
      message.to(user.email)
    })
  } catch (error) {
    console.log(error)
  }
})
