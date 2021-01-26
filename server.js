const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const formidable = require("formidable");


const port = process.env.PORT || 3000;
const app = express();

const storage = {
  files: [],
  autoIncrement: 1
}

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", hbs({ 
defaultLayout: "main.hbs", 
extname: '.hbs',
partialsDir: path.join(__dirname, 'views', 'partials')

})); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs"); // określenie nazwy silnika szablonów

app.use(express.static(path.join(__dirname, 'static')));

app.get("/", function (req, res) {
  res.redirect("/filemanager");
});

app.get('/download/:id', (req, res) => {
  res.download(path.join(__dirname, 'static', 'upload', ));
});

app.get("/filemanager", function (req, res) {
  res.render("filemanager.hbs", { files: storage.files });
  console.log(storage.files)
});

app.get("/upload", function (req, res) {
  res.render("upload.hbs");
});

app.post("/upload", function (req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/static/upload/"; // folder do zapisu zdjęcia
  form.keepExtensions = true; // zapis z rozszerzeniem pliku
  form.multiples = true; // zapis wielu plików
  form.parse(req, function (err, fields, files) {
    files = files.file;
    if (!Array.isArray(files)) files = [files];

    files.forEach(file =>{
      file.id = storage.autoIncrement++
      storage.files.push(file);
    })

    res.redirect("/filemanager");
  });
});


app.get("/delete/:id", function (req, res) {
   const id = req.params.id
 
   for (let i=0; i < storage.files.length; i++) {
     const file = storage.files[i];
     if (file.id == id || id == 'all') {
       storage.files.splice(i, 1)
     }
   }
 
   return res.redirect("/filemanager")
 });

app.listen(port, () => {
  console.log(`Listening at http://localhost:3000`);
});
