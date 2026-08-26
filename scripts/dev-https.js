const fs = require("fs");
const https = require("https");
const next = require("next");

const hostname = "localhost";
const port = 3001;

const app = next({
  dev: true,
  hostname,
  port,
});

const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./certificates/localhost-key.pem"),
  cert: fs.readFileSync("./certificates/localhost.pem"),
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      handle(req, res);
    })
    .listen(port, hostname, () => {
      console.log("");
      console.log("========================================");
      console.log(" HTTPS development server is running");
      console.log("========================================");
      console.log(` Local: https://${hostname}:${port}`);
      console.log("");
    });
});
