const { User } = require("../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = req.body;

    const schema = Joi.object({
      fullName: Joi.string().min(3).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.send({
        status: "Failed",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const dataUser = await User.create({
      ...data,
      password: hashedPassword,
    });

    const updateUser = await User.findOne({
      where: {
        email,
      },
    });

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: updateUser.id,
      },
      secretKey
    );

    res.status(200).send({
      status: "Success",
      data: {
        user: {
          fullName: dataUser.fullName,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.send({
        status: "Validation failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail) {
      return res.send({
        status: "Login failed",
        message: "Email/Password is wrong",
      });
    }

    const checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkPassword) {
      return res.send({
        status: "Login Failed",
        message: "Email/Password is wrong",
      });
    }

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: checkEmail.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      data: {
        user: {
          id: checkEmail.id,
          fullName: checkEmail.fullName,
          email: checkEmail.email,
          avatar: checkEmail.avatar,
          phone: checkEmail.phone,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.authUser = async (req, res) => {
  try {
    const id = req.userId;

    const dataUser = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updateAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "user valid",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.fullName,
          email: dataUser.email,
          avatar: dataUser.avatar,
          phone: dataUser.phone,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
