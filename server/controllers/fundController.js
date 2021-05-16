const { Fund, UsersDonate } = require("../models");
const fs = require("fs");

// exports.getFunds = async (req, res) => {
//   try {
//     const dataFunds = await Fund.findAll({
//       include: [
//         {
//           model: UsersDonate,
//           as: "usersDonate",
//           attributes: {
//             exclude: ["createdAt", "updatedAt", "fundId", "userId"],
//           },
//         },
//       ],
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });

//     res.status(200).send({
//       status: "success",
//       data: { funds: dataFunds },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: "failed",
//       message: "server error",
//     });
//   }
// };

exports.getFunds = async () => {
  let dataFunds = await Fund.findAll({
    include: [
      {
        model: UsersDonate,
        as: "usersDonate",
        attributes: {
          exclude: ["createdAt", "updatedAt", "fundId", "userId"],
        },
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  dataFunds = JSON.parse(JSON.stringify(dataFunds));

  return dataFunds.map((funds) => {
    return {
      ...funds,
    };
  });
};

// exports.getFund = async (id) => {
//   try {
//     let dataFund = await Fund.findOne({
//       where: {
//         id,
//       },
//       include: [
//         {
//           model: UsersDonate,
//           as: "usersDonate",
//           attributes: {
//             exclude: ["createdAt", "updatedAt", "fundId", "userId"],
//           },
//         },
//       ],
//       attributes: {
//         exclude: ["createdAt", "updatedAt", "userId"],
//       },
//     });
//     dataFund = JSON.parse(JSON.stringify(dataFund));

//     return {
//       status: "success",
//       data: dataFund,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.getFundsByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const dataFunds = await Fund.findAll({
      where: { UserId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: { funds: dataFunds },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getFundsDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const dataFund = await Fund.findOne({
      where: {
        id,
      },
      include: [
        {
          model: UsersDonate,
          as: "usersDonate",
          attributes: {
            exclude: ["createdAt", "updatedAt", "fundId", "userId"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    if (!dataFund) {
      return res.send({
        status: "failed",
        message: "data not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: { fund: dataFund },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.createFund = async (req, res) => {
  try {
    const thumbnail = req.files.thumbnail[0].filename;

    const dataFund = await Fund.create({
      ...req.body,
      thumbnail,
    });

    res.status(200).send({
      status: "success",
      data: {
        fund: dataFund,
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

exports.updateFund = async (req, res) => {
  try {
    const { id } = req.params;

    const findFund = await Fund.findOne({ where: { id } });

    if (!findFund) {
      return res.send({
        status: "failed",
        message: "data not found",
      });
    }

    if (req.files) {
      var thumbnail = req.files.thumbnail[0].filename;
      fs.unlink(`storage/${findFund.thumbnail}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const dataFund = {
      ...req.body,
      thumbnail,
    };

    await Fund.update(dataFund, {
      where: { id },
    });

    const updateFund = await Fund.findOne({
      where: { id },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });

    res.status(200).send({
      status: "Success",
      data: {
        fund: {
          title: updateFund.title,
          goal: updateFund.goal,
          description: updateFund.description,
          thumbnail: updateFund.thumbnail,
          usersdonate: [],
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteFund = async (req, res) => {
  try {
    const id = req.params.id;

    const findFund = await Fund.findOne({ where: { id } });

    if (!findFund) {
      return res.send({
        status: "failed",
        message: "Data not found",
      });
    }

    fs.unlink(`storage/${findFund.thumbnail}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    await Fund.destroy({ where: { id } });

    res.status(200).send({
      status: "success",
      data: { id: findFund.id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
