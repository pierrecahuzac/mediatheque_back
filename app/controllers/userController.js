const UserModel = require("../models/userModel");
const validator = require("email-validator");
const bcrypt = require("bcrypt");

const userController = {
  getOneUser: async (req, res) => {
    try {
      const userId = req.params._id;
      const user = await UserModel.findById({
        _id: userId,
      });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },

  signUp: async (req, res) => {
    const { email, password, password_validation } = req.body;
    const bodyErrors = [];
    const userExist = await UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!email) {
      bodyErrors.push("email cannot be empty");
    }
    if (!password) {
      bodyErrors.push("password cannot be empty");
    }
    if (!password_validation) {
      bodyErrors.push("password confirmation cannot be empty");
    }
    if (password !== password_validation) {
      bodyErrors.push("passwords must be the same");
    }
    if (userExist) {
      bodyErrors.push("this e-mail is already registered");
    }
    if (bodyErrors.length) {
      return res.status(400).json(bodyErrors);
    }
    validator.validate(email);
    if (userExist) {
      return res.status(500).json("email exist in the base");
    }
    const saltCrypt = 10;
    const salt = await bcrypt.genSaltSync(saltCrypt);
    try {
      await UserModel.create({
        email,
        password: await bcrypt.hashSync(password, salt),
        password_validation: await bcrypt.hashSync(password_validation, salt),
      });
      //await newUser.save();
      res.status(200).json(res.data);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        email,
      });

      if (user && (await bcrypt.compareSync(password, user.password))) {
        req.session.user = user.get({
          plain: true,
        });
        delete req.session.user.password;
        res.json({
          logged: true,
          info: req.session.user,
        });
      } else {
        res.json("error 401 unauthorized");
        res.status(401).end();
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
