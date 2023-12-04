const mongoose = require("mongoose");
const Note = require("../app.js");
const initData = require("./data.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/notesapp";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async()=>{
    await Note.deleteMany({});
    await Note.insertMany(initData.data);
    console.log("data was initialized");
};

initDb();