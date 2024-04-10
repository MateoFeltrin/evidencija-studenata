const express = require('express');
const app = express ();
app.use(express.json());
var fs = require('fs'); //require file system object

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});

app.get("/status", (request, response) => {
   const status = {
      "Status": "Running"
   };
   response.send(status);
});

// ovdje su smješteni svi backend djelovi aplikacije
