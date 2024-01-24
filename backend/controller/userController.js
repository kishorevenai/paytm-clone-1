const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");
const Bank = require("../schemas/Account");

const signupZod = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});

const Signup = async (req, res) => {
  const validation = signupZod.safeParse(req.body);
  const { username, password, firstname, lastname } = req.body;

  const duplicate = await User.find({ username }).lean().exec();

  console.log(duplicate)

  if (duplicate.username === username) {
    return res.json({ message: "The username already exists" });
  }

  const hashPwd = bcrypt.hash(password, 10);

  try {
    const result = await User.create({
      username,
      password: (await hashPwd).toString(),
      firstName: firstname,
      lastName: lastname,
    });

    if (result) {
      const userId = result._id;

      // --------------create-account-------------------

      const bankResult = await Bank.create({
        userId,
        balance: 1 + Math.random() * 10000,
      });

      return res
        .json({ message: `The user ${result.username} created` })
        .status(201);
    }
  } catch (error) {
    return res.json({ err: error }).status(200);
  }
};

const SignIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .json({ message: "The username and password are required" })
      .status(200);

  const result = await User.findOne({ username }).exec();

  if (!result)
    return res.json({ message: "The username is unavilable" }).status(400);

  const verify = await bcrypt.compare(password, result.password);

  if (!verify) return res.json({ message: "unauthorized" }).status(401);

  if (verify) {
    const accessToken = jwt.sign(
      {
        credentials: {
          username,
          userId:result._id
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    return res.json(accessToken).status(200);
  }
};

const UpdateUser = async (req, res) => {
  const { id, username, firstname, lastname, password } = req.body;

  if (!id) return res.json({ message: "The username is required" }).status(400);
  try {
    const result = await User.findById(id).exec();

    if (!result)
      return res
        .json({ message: "Please provide the correct credentials" })
        .status(400);

    result.firstName = firstname;
    (result.lastName = lastname), (result.username = username);

    if (password) {
      const hashedPwd = await bcrypt.hash(password, 10);
      result.password = hashedPwd;
    }

    result.save();
  } catch (error) {
    return res
      .json({ message: "The user ID provided is not available" })
      .status(400);
  }
  return res.json({ message: "The credentials are updated" }).status(201);
};

module.exports = {
  Signup,
  SignIn,
  UpdateUser,
};
