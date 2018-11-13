/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  // User
  'POST /api/user/register': 'UserController.register',
  'PATCH /api/user/login': 'UserController.login',
  'PATCH /api/user/logout': 'UserController.logout',
  'GET /api/user/friends': 'UserController.getFriends',

  // Friendship
  'POST /api/friendship': 'FriendshipController.sendFriendRequest',
  'PUT /api/friendship': 'FriendshipController.acceptFriendRequest',
  'DELETE /api/friendship': 'FriendshipController.deleteFriendship',

  // Thread
  'GET /api/friendship/threads': 'ThreadController.getThreadsForFriendship',
  'GET /api/thread': 'ThreadController.getMessages',
  'POST /api/thread/create': 'ThreadController.create',
  'PUT /api/thread/archive': 'ThreadController.archive',
  'PUT /api/thread/unarchive': 'ThreadController.unarchive',

  // Message
  'POST /api/message/send': 'MessageController.send',

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝±


};
