const express = require("express");

const router = express.Router();

const { auth } = require("../middleware/auth");
const { uploadImg } = require("../middleware/uploadImg");

const {
  getUsers,
  getUsersDetail,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");
router.get("/users", getUsers);
router.get("/user/:id", auth, getUsersDetail);
router.patch("/user/:id", uploadImg("avatar"), auth, updateUser);
router.delete("/user/:id", deleteUser);

const {
  createFund,
  getFundsDetail,
  updateFund,
  deleteFund,
  getFundsByUser,
} = require("../controllers/fundController");
router.get("/fund/:id", auth, getFundsDetail);
router.get("/funds/:id", auth, getFundsByUser);
router.post("/fund", auth, uploadImg("thumbnail"), createFund);
router.patch("/fund/:id", auth, uploadImg("thumbnail"), updateFund);
router.delete("/fund/:id", auth, deleteFund);

const {
  getDonate,
  updateDonate,
  getDonateProfile,
  createDonate,
  getDonates,
} = require("../controllers/donateController");
router.get("/donates", getDonates);
router.get("/donate", auth, getDonateProfile);
router.get("/donate/:id/", auth, getDonate);
router.post("/donate", auth, uploadImg("proofAttachment"), createDonate);
router.patch("/donate/:id", auth, updateDonate);

const { register, login, authUser } = require("../controllers/authController");
router.post("/register", register);
router.post("/login", login);
router.get("/authuser", auth, authUser);

module.exports = router;
