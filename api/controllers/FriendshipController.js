/**
 * FriendshipController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  sendFriendRequest: async (req, res) => {
    try {
      const currUserId = req.user.id;
      const otherUserId = req.param('userId');

      if (currUserId == otherUserId) {
        return res.badRequest();
      }

      const newFriendship = await Friendship.create({
        user_a: currUserId,
        user_b: otherUserId
      }).fetch();

      return res.ok(newFriendship);
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

