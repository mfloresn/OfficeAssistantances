const express = require("express"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    { CronJob } = require("cron"),
    path = require("path");
const getAssistancesPerDay = require("../controllers/GetAssistancesPerDay");
const { dbConnection } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3030;
        this.paths = {
            index: "/",
            auth: "/api/user",
            assistance: "/api/assistance",
            mail: "/api/mail",
        };
        this.connectDb();
        this.middlewares();
        this.routes();
    }

    connectDb() {
        dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    routes() {
        this.app.use(express.static(path.join(__dirname, "./client/")));
        // Show index.html when the route '/' is requested
        this.app.get(this.paths.index, (req, res) => {
            res.sendFile(path.join(__dirname, "./client/"));
        });
        this.app.use(this.paths.auth, require("../routes/auth"));
        this.app.use(this.paths.assistance, require("../routes/assistance"));
        this.app.use(this.paths.mail, require("../routes/mailer"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
            console.log(`Time: ${new Date().getHours()}:${new Date().getMinutes()}`);
            new CronJob("0 7 * * *", () => {
                console.log(`Time: ${new Date().getHours()}:${new Date().getMinutes()}`);
                getAssistancesPerDay();
            }, null, true, "America/Mexico_City");
        });
    }
}

module.exports = Server;
