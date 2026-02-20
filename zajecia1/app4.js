//forms service (POST)
const http = require("http")
const fs = require("fs")
const path = require("path");
const { title } = require("process");

let tasks = [];

const server = http.createServer((req, res) => {

    const myUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = myUrl.pathname;

    if (pathname === "/" && req.method === "GET") {

        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error 500");
                console.log(err.message);
                return;
            }
            res.writeHead(200, { "Content-type": "text/html" });
            res.end(data);
        });

    }

    else if (pathname === "/api" && req.method === "GET") {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(tasks));
    }

    //POST
    else if (pathname === "/api" && req.method === "POST") {
        let body = "";
        req.on("data", c => {
            body += c;
        });

        req.on("end", () => {
            try {
                const parsed = JSON.parse(body)
                const task = {id:Date.now(),title:parsed.title}
                tasks.push(task)
              //  console.log(task)
                res.writeHead(201, { "Content-type": "application/json" });
                res.end(JSON.stringify(task))

            } catch (err) {
                res.writeHead(400, { "Content-type": "application/json" });
                res.end(JSON.stringify({ error: err.message }))
            }

        })
    }

    else {
        res.writeHead(404);
        res.end("Error 404: Not exists");
    }

});

server.listen(3000, () => {
    console.log("Server works: http://localhost:3000")

});