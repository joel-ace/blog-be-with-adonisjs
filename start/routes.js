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
  // Users
  Route.get('users', 'UserController.index').middleware(['adminOnly'])
  Route.get('users/:id', 'UserController.show').middleware(['isAdminOrUserOwn'])
  Route.post('users', 'UserController.store')
  Route.patch('users/:id', 'UserController.update').middleware(['isAdminOrUserOwn'])
  Route.delete('users/:id', 'UserController.destroy').middleware(['adminOnly', 'findUser'])

  // Authentication
  Route.post('auth/login', 'UserController.login')
  Route.post('auth/verify-email/:token', 'UserController.verifyEmail')
  Route.post('auth/change-password/:id', 'UserController.updatePassword')
  Route.post('auth/forgot-password', 'UserController.forgotPassword')
  Route.post('auth/reset-password/:token', 'UserController.updatePasswordByToken')

  // Category
  Route.get('category', 'CategoryController.index')
  Route.post('category', 'CategoryController.store').middleware(['adminOnly'])
  Route.patch('category/:id', 'CategoryController.update').middleware(['adminOnly', 'findCategory'])
  Route.delete('category/:id', 'CategoryController.destroy').middleware(['adminOnly', 'findCategory'])

  // Posts
  Route.get('posts', 'PostController.index').middleware(['checkUserType'])
  Route.get('posts/slug/:slug', 'PostController.show').middleware(['checkUserType', 'findPost'])
  Route.get('posts/:id', 'PostController.show').middleware(['checkUserType', 'findPost'])
  Route.post('posts', 'PostController.store').middleware(['adminOnly'])
  Route.patch('posts/slug/:slug', 'PostController.update').middleware(['adminOnly', 'findPost'])
  Route.patch('posts/:id', 'PostController.update').middleware(['adminOnly', 'findPost'])
  Route.delete('posts/slug/:slug', 'PostController.destroy').middleware(['adminOnly', 'findPost'])
  Route.delete('posts/:id', 'PostController.destroy').middleware(['adminOnly', 'findPost'])

  //Post Comments
  Route.post('posts/slug/:slug/comments', 'CommentController.store').middleware(['auth', 'findPost'])
  Route.post('posts/:id/comments', 'CommentController.store').middleware(['auth', 'findPost'])
  Route.delete('comments/:id', 'CommentController.destroy').middleware(['adminOnly', 'findComment'])


  // Tags
  Route.get('tags', 'TagController.index')
  Route.post('tags', 'TagController.store').middleware(['adminOnly'])
  Route.patch('tags/:id', 'TagController.update').middleware(['adminOnly', 'findTag'])
  Route.delete('tags/:id', 'TagController.destroy').middleware(['adminOnly', 'findTag'])

}).prefix('api')

//Just to test email template views
//DELETE WHEN DONE
Route.get('temp', ({ view }) => view.render('email.passwordchanged'))


