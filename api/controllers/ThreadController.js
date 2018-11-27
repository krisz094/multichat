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
    const afterMsgId = req.param('afterId');
    const beforeMsgId = req.param('beforeId');
    let messages;
    if (afterMsgId) {
      messages = await Message.find({
        where: {
          thread: threadId,
          id: { '>': afterMsgId }
        },
      })
    }
    else if (beforeMsgId) {
      messages = await Message.find({
        where: {
          thread: threadId,
          id: { '<': beforeMsgId }
        },
        sort: 'createdAt DESC',
        limit: 10,
      });
      messages = messages.reverse();
    } else {
      messages = await Message.find({
        where: { thread: threadId },
        sort: 'createdAt DESC',
        limit: 10,
      });
      messages = messages.reverse();
    }
    messages.forEach(msg => {
      msg.sentByYou = msg.sender == currUserId;
    })
    return res.ok(messages);
  },
  getThreadsForFriendship: async function (req, res) {
    try {
      const currUserId = req.user.id;
      // friendship check TODO
      const friendshipId = req.param('friendshipId');
      const threads = await Thread.find({
        where: { friendship: friendshipId },
        sort: 'updatedAt DESC'
      }).populate('lastActivity');
      threads.forEach(thread => {
        if (thread.lastActivity) {
          thread.lastActivity.sentByYou = currUserId == thread.lastActivity.sender;
        }
      });
      return res.ok(threads);
    }
    catch (err) {
      return res.badRequest(err);
    }
    return res.badRequest('not available yet');
  }
};

