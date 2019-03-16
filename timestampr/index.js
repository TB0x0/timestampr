// Thomas McLean
// March 3, 2019
// timestampr
// Based off of https://freshman.tech/microservice/

// Creating HTTP server
const http = require("http");  
const fs = require("fs"); 

const getTimestamp = date => ({
    unix: date.getTime(),
    utc: date.toUTCString()
});

const requestHandler = (req, res) => {
    if (req.url === "/") {
        fs.readFile("views/index.html", "utf8", (err, html) => {
            if (err) throw err;

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    } else if (req.url.startsWith("/api/timestamp")) {          // Does request url start with /api/timestamp
        const dateString = req.url.split("/api/timestamp/")[1]; // Then split the string and get dateString part
        let timestamp;

        if (dateString === undefined || dateString.trim() === "") { // dateString is undefined or empty then make a new one
            timestamp = getTimestamp(new Date());
        } else {
            const date = !isNaN(dateString) ? new Date(parseInt(dateString)) : new Date(dateString);

            if (!isNaN(date.getTime())) {
                timestamp = getTimestamp(date);
            } else {
                timestamp = {
                    error: "invalid date"
                };
            }
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(timestamp));
    } else {
        fs.readFile("views/404.html", (err, html) => {
            if (err) throw err;

            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(html);
        });
    }
};

const server = http.createServer(requestHandler);

server.listen(process.env.PORT || 4100, err => {
    if (err) throw err;
    console.log(`Server running on port ${server.address().port}`);
});