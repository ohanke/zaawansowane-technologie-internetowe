//query parameters http://localhost:3000/api?name=Jan
const http = require("http")

const server = http.createServer((req, res) => {
 
    const myUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = myUrl.pathname;
    const query = Object.fromEntries(myUrl.searchParams);

    console.log(query.name)
 
    if (pathname === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-type": "text/plain" });
        res.end("Main page");
    }
 
    else if (pathname === "/api" && req.method === "GET"){
        res.writeHead(200, { "Content-type": "application/json" });
 
        const x = query.name || "World"
 
        res.end(JSON.stringify({hello:x}));
    }
 
    else{
        res.writeHead(404);
        res.end("Error 404: Not exists");
    }
 
});
 
server.listen(3000, () => {
    console.log("Server works: http://localhost:3000")
 
});