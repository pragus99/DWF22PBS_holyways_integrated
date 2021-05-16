const { UsersDonate, Fund, User } = require("../models");
const { Sequelize } = require("sequelize");

exports.getDonateProfile = async (req, res) => {
  try {
    let datadonates = await UsersDonate.findAll({
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: datadonates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getDonates = async (req, res) => {
  try {
    const dataDonate = await UsersDonate.findAll({
      where: { status: "success" },
      attributes: [
        "fundId",
        [Sequelize.fn("sum", Sequelize.col("donateAmount")), "donateAmount"],
      ],
      group: ["fundId"],
    });
    res.status(200).send({
      status: "success",
      data: dataDonate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

// exports.getDonates = async (req, res) => {
//   try {
//     const dataDonate = await UsersDonate.findAll({
//       attributes: {
//         exclude: ["updatedAt"],
//       },
//     });
//     res.status(200).send({
//       status: "success",
//       data: dataDonate,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: "failed",
//       message: "server error",
//     });
//   }
// };

exports.getDonate = async (req, res) => {
  const { id } = req.params;

  try {
    const dataFund = await Fund.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const dataDonate = await UsersDonate.findAll({
      where: { fundid: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["updatedAt"],
      },
    });
    res.status(200).send({
      status: "success",
      data: { donate: dataDonate, fund: dataFund },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.createDonate = async (req, res) => {
  try {
    const proofAttachment = req.files.proofAttachment[0].filename;

    const donates = await UsersDonate.create({
      ...req.body,
      proofAttachment,
    });
    console.log(donates);

    res.status(200).send({
      status: "success",
      data: donates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateDonate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const dataDonate = {
      status,
    };

    await UsersDonate.update(dataDonate, {
      where: { id },
    });

    const updateDonate = await UsersDonate.findAll({
      where: { id },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    res.status(200).send({
      status: "Success",
      data: {
        updateDonate,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server erreeor",
    });
  }
};
