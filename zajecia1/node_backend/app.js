//forms service (POST)
const http = require("http")

let tasks = [];

const server = http.createServer((req, res) => {

    const myUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = myUrl.pathname;

    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers","Content-Type")

    //preflight
    if(req.method==="OPTIONS"){
        res.writeHead(204);
        res.end()
        return;
    }


    if (pathname === "/api" && req.method === "GET") {
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