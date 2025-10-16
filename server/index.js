import app from "./express.js";

const port = process.env.PORT || 7000;

// ** start Server **
app.listen(port, () => console.log(`Server is running on port: ${port}`));
