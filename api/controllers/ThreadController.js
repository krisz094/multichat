/**
 * ThreadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
    const friendshipId = req.param('friendshipId');
    const newThread = await Thread.create({
      friendship: friendshipId
    }).fetch();

    return res.ok(newThread);
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
    const currUserId = req.user.id;
    const threadId = req.param('threadId');
    const messages = await Message.find({ thread: threadId });
    messages.forEach(msg => {
      msg.sentByYou = msg.sender == currUserId;
    })
    return res.ok(messages);
  },
  getThreadsForFriendship: async function (req, res) {
    try {
      const friendshipId = req.param('friendshipId');
      const threads = await Thread.find({ friendship: friendshipId });
      return res.ok(threads);
    }
    catch (err) {
      return res.badRequest(err);
    }
    return res.badRequest('not available yet');
  }
};

