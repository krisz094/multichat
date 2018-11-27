/**
 * FriendshipController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Emailaddresses = require('machinepack-emailaddresses')

module.exports = {
  sendFriendRequest: async (req, res) => {
    try {
      const currUserId = req.user.id;
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

          const otherUser = await User.findOne({ email: req.param('email') });
          if (!otherUser) {
            return  res.badRequest('Couldn\'t find user.');
          }
          const otherUserId = otherUser.id;
          if (currUserId == otherUserId) {
            return res.badRequest('Can\'t send a request to yourself.');
          }

          const existingFriendship = await Friendship.find({
            or: [
              { user_a: currUserId, user_b: otherUserId },
              { user_b: currUserId, user_a: otherUserId }
            ]
          });

          if (existingFriendship.length != 0) {
            return res.badRequest('Friendship already exists.');
          }

          const newFriendship = await Friendship.create({
            user_a: currUserId,
            user_b: otherUserId
          }).fetch();

          return res.ok(newFriendship);
        }
      })
    }
    catch (err) {
      return res.badRequest(err);
    }
  },
  acceptFriendRequest: async (req, res) => {
    try {
      const currUserId = req.user.id;
      const friendshipId = req.param('friendshipId');

      const friendship = await Friendship
        .update({ id: friendshipId, user_b: currUserId, active: false })
        .set({ active: true })
        .fetch();

      return res.ok(friendship);
    }
    catch (err) {
      return res.badRequest(err);
    }

  },
  deleteFriendship: async (req, res) => {
    try {
      const friendshipId = req.param('friendshipId');

      const friendship = await Friendship
        .destroy({ id: friendshipId })
        .fetch();

      return res.ok(friendship);
    }
    catch (err) {
      return res.badRequest(err);
    }
  }

};

