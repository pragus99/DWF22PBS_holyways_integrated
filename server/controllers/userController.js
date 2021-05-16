const { User, UsersDonate } = require("../models");
const fs = require("fs");
const Joi = require("joi");

exports.getUsers = async (req, res) => {
  try {
    const dataUser = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.status(200).send({
      status: "success",
      data: { users: dataUser },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getUsersDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const dataUser = await User.findOne({
      where: {
        id,
      },
      include: [
        {
          model: UsersDonate,
          as: "usersDonate",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.send({
        status: "failed",
        message: "data not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        user: dataUser,
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

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const findUser = await User.findOne({ where: { id } });

    if (!findUser) {
      return res.send({
        status: "Error",
        message: "User doesn't exist",
      });
    }

    if (req.files) {
      var avatar = req.files.avatar[0].filename;

      fs.stat(`storage/${findUser.avatar}`, function (err, stats) {
        if (err) {
          return console.log(err);
        }

        fs.unlink(`storage/${findUser.avatar}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }

    const dataUpdated = {
      ...body,
      avatar,
    };

    await User.update(dataUpdated, {
      where: { id },
    });

    const updateUser = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt", "password"],
      },
    });
    console.log(updateUser),
      res.status(200).send({
        status: "success",
        data: { user: updateUser },
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const findUser = await User.findOne({ where: { id } });

    if (!findUser) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }
    await User.destroy({ where: { id } });

    res.status(200).send({
      status: "Sucessfully delete data",
      data: { id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
