'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.group(() => {
  Route.resource('users', 'UserController')
    .apiOnly()

  Route.post('auth/login', 'UserController.login')
  Route.post('auth/verify-email/:token', 'UserController.verifyEmail')
  Route.post('auth/change-password', 'UserController.updatePassword')
  Route.post('auth/forgot-password', 'UserController.forgotPassword')
  Route.post('auth/reset-password/:token', 'UserController.updatePasswordByToken')
}).prefix('api')

//Just to test email template views
//DELETE WHEN DONE
Route.get('temp', ({ view }) => view.render('email.passwordchanged'))


