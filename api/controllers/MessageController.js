/**
 * MessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  send: async function (req, res) {
    const senderUser = await User.findOne({ id: req.user.id });
    const text = req.param('text');
    const threadId = req.param('threadId');

    if (text.trim().length == 0) {
      return res.badRequest();
    }

    const threadCheck = await Thread.findOne({ id: threadId });
    if (!threadCheck) {
      return res.badRequest('You\'re not allowed to send messages to this thread');
    }
    const friendshipCheck = await Friendship.findOne({ id: threadCheck.friendship });
    if (!friendshipCheck) {
      return res.badRequest('You\'re not allowed to send messages to this thread');
    }
    if (!(friendshipCheck.user_a == senderUser.id || friendshipCheck.user_b == senderUser.id)) {
      return res.badRequest('You\'re not allowed to send messages to this thread');
    }
    const newMessage = await Message.create({ text, thread: threadId, sender: senderUser.id }).fetch();


    const thread = await Thread.updateOne({ id: threadId }).set({ lastActivity: newMessage.id });

    return res.ok();
  },
};

