const { getFunds } = require("../controllers/fundController");
module.exports.respond = (endpoint, socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnect");
    socket.disconnect();
  });

  socket.on("get funds", async () => {
    const funds = await getFunds();
    socket.emit("funds", funds);
  });
};
