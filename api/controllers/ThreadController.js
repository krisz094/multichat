/**
 * ThreadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
  /*   const otherUserId = req.param('userId');

    const creatorUser = await User.findOne({ id: req.user.id });
    const targetUser = await User.findOne({ id: otherUserId });
    const newThread = await Thread.create({
      users: [
        creatorUser.id,
        targetUser.id
      ]
    }).fetch();

    res.ok(newThread); */
  },
  archive: async function (req, res) {
    await Thread
      .update({ id: req.param('threadId') })
      .set({ archived: true });
    return res.ok();
  },
  unarchive: async function (req, res) {
    await Thread
      .update({ id: req.param('threadId') })
      .set({ archived: false });
    return res.ok();
  },
  getMessages: async function (req, res) {
    // const user = await User.findOne({ id: req.user.id });
    let messages = await Thread.findOne({ id: req.param('threadId') }).populate('messages');
    messages.messages.forEach(message => {
      message.isUserSender = req.user.id == message.sender;
    })
    messages = messages.messages;
    return res.ok(messages);
  },
  getThreadsForFriendship: async function (req, res) {
    return res.badRequest('not available yet');
  }
};

