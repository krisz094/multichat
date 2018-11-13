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

    const thread = await Thread.findOne({ id: threadId });
    const newMessage = await Message.create({ text, thread: threadId, sender: senderUser.id });

    return res.ok();
  },
};

