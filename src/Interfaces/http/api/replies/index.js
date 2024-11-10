const ReplyHandler = require("./handler");
const routes = require("./routes");

module.exports={
  name: 'replies',
  register: async (server, { container }) => {
    const repliesHandler = new ReplyHandler(container);
    server.route(routes(repliesHandler))
  }
}