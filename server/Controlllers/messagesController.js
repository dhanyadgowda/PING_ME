const MessageModel = require("../model/MessageModel")


module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await MessageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};


module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await MessageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from, // Fix: `sender` should reference `from`
    });
    if (data) {
      return res.json({ msg: "Message added successfully" });
    } else {
      return res.json({ msg: "Failed to add message" });
    }
  } catch (ex) {
    next(ex); // `next` will now be defined
  }
};
