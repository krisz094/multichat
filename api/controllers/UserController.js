/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var Emailaddresses = require('machinepack-emailaddresses')

module.exports = {
  register: async function (req, res) {
    if (_.isUndefined(req.param('email'))) {
      return res.badRequest('An email address is required.')
    }

    if (_.isUndefined(req.param('password'))) {
      return res.badRequest('A password is required.')
    }

    if (req.param('password').length < 8) {
      return res.badRequest('Password must be at least 8 characters.')
    }

    Emailaddresses.validate({
      string: req.param('email'),
    }).exec({
      error: function (err) {
        return res.serverError(err)
      },
      invalid: function () {
        return res.badRequest('Doesn\'t look like an email address.')
      },
      success: async function () {
        sails.helpers.createUser.with({
          email: req.param('email'),
          password: req.param('password'),
          nickname: req.param('nickname')
        }).switch({
          success: function (user) {
            // after creating a user record, log them in at the same time by issuing their first jwt token and setting a cookie
            var token = jwt.sign({ user: user.id }, sails.config.jwtSecret, { expiresIn: sails.config.jwtExpires })

            return res.ok(token);
          },
          invalid: function (err) {
            return res.badRequest('invalid request', err)
          },
          emailAlreadyInUse: function () {
            return res.badRequest('email already used')
          },
          error: function (err) {
            return res.serverError(err);
          }
        });
      }
    });
  },
  login: async function (req, res) {
    var user = await User.findOne({
      email: req.param('email')
    })
    if (!user) return res.badRequest('User not found or password invalid');

    const result = await bcrypt.compare(req.param('password'), user.password)

    if (!result) {
      return res.badRequest('User not found or password invalid');
    }
    // if no errors were thrown, then grant them a new token
    // set these config vars in config/local.js, or preferably in config/env/production.js as an environment variable
    var token = jwt.sign({ user: user.id }, sails.config.jwtSecret, { expiresIn: sails.config.jwtExpires })

    // provide the token to the client in case they want to store it locally to use in the header (eg mobile/desktop apps)
    return res.ok(token)
  },
  logout: async function (req, res) {
    res.clearCookie('sailsjwt')
    req.user = null
    return res.ok()
  },
  /* getThreads: async function (req, res) {
    const user = await User.findOne({ id: req.user.id }).populate('threads');
    return res.ok(user);
  }, */
  getFriends: async function (req, res) {
    try {
      const currUserId = req.user.id;
      const friendships = await Friendship.find({
        or: [
          { user_a: currUserId },
          { user_b: currUserId }
        ],
        active: true
      }).populate('user_a').populate('user_b');
      const mappedFriends = friendships.map(friendship => {
        const otherUser = friendship.user_a.id == currUserId ? friendship.user_b : friendship.user_a;

        return { friendshipId: friendship.id, friend: otherUser };
      })
      return res.ok(mappedFriends);
    }
    catch (err) {
      return res.badRequest(err);
    }
  },
  getFriendRequests: async function (req, res) {
    try {
      const currUserId = req.user.id;
      const friendships = await Friendship.find({
        user_b: currUserId,
        active: false
      }).populate('user_a').populate('user_b');
      const mappedFriends = friendships.map(friendship => {
        const otherUser = friendship.user_a.id == currUserId ? friendship.user_b : friendship.user_a;

        return { friendshipId: friendship.id, friend: otherUser };
      })
      return res.ok(mappedFriends);
    }
    catch (err) {
      return res.badRequest(err);
    }
  }
};

