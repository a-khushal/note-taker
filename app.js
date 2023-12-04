const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ejsMate = require("ejs-mate");


app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

main()
    .then(()=>{console.log("connection successful");})
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/notesapp');
}

const notesSchema = new Schema({
    title: String,
    content: String,
});

const Note = mongoose.model("Note", notesSchema);
module.exports = Note;

app.get("/", (req, res)=>{
    res.send("root page");
});

app.get("/notes", async(req, res)=>{
    try{
        const allNotes = await Note.find({});
        // console.log(allNotes);
        res.render("index.ejs", {allNotes});
    } catch(err){
        res.send("some error occured");
    }
});

app.get("/new",(req, res)=>{
    res.render("create.ejs")
})

app.post("/notes", async(req, res)=>{
    try{
        let {title, notes} = req.body;
        const newNotes = new Note({title: title, content: notes});
        await newNotes.save();
        res.redirect("/notes");
    } catch(err){
        res.send("some error occured");
    }
    
})

app.get("/notes/:id", async(req, res)=>{
    let {id} = req.params;
    try{
        const allNotes = await Note.findById(id);
        res.render("show.ejs", {allNotes});
    }   
    catch(err){
        res.send("some error occured");
    }
});

app.get("/notes/:id/edit", async(req, res)=>{
    try{
        let {id} = req.params
        const allNotes = await Note.findById(id);
        res.render("edit.ejs", {allNotes});
    } catch(err){
        res.send("internal server error");
    }
});

app.put("/notes/:id", async(req, res)=>{
    let {id} = req.params;
    try{
        await Note.findByIdAndUpdate(id, {
            ttitle: req.body.title,
            content: req.body.notes,
        });
        res.redirect(`/notes/${id}`);
    } catch(err){
        res.send("some error occured");
    }
});

app.delete("/notes/:id", async(req, res)=>{
    let {id} = req.params;
    try{
        await Note.findByIdAndDelete(id);
        res.redirect("/notes");
    } catch(err){
        res.send("internal error");
    }
});

app.listen(5000, ()=>{
    console.log("listening to port 5000");
})




