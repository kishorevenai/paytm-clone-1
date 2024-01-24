const mongoose = require("mongoose");

const Account = require("../schemas/Account");

const getBalance = async (req, res) => {
  const { userId } = req.body;

  try {
    const account = await Account.findOne({ userId });
    return res.json({ account_details: account }).status(200);
  } catch (error) {
    return res
      .json({ message: "Server error, please check after sometimes" })
      .status(400);
  }
};

const transferAmount = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  const { amount, to } = req.body;

  //Fetch the account within the transaction

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.json({ message: "Insufficient balance" });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  //Commit the transaction

  await session.commitTransaction();

  res.json({
    message: "Transfered successfully",
  });
};

module.exports = {
  getBalance,
  transferAmount,
};
