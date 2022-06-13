// Módulo requerido
const express = require("express");
const multer = require("multer");
const port = 3000;
const app = express();
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const fs = require("fs");
  

/*
    Creando una carpeta de uploads si aún no está presente
    En la carpeta "uploads" subiremos temporalmente
    imagen antes de subir a cloudinary
*/
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
   
    // Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
  
var upload = multer({ storage: storage });
  

    // Configuración del analizador de cuerpo
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
  
// Cloudinary configuration
cloudinary.config({ 
  cloud_name: 'dsjiahwlm', 
  api_key: '566495581743278', 
  api_secret: 'BmHhlMF8lrhxtddkRdUemRGRxYk' 
});
  
async function uploadToCloudinary(locaFilePath) {
  
/*
    locaFilePath: ruta de la imagen que acaba de ser
    subido a la carpeta "cargas"
*/
   
    var mainFolderName = "main";
    /*
        ruta del archivo en Cloudinary: ruta de la imagen que queremos
        para configurar cuando se sube a cloudinary
    */
    var filePathOnCloudinary = 
        mainFolderName + "/" + locaFilePath;
  
    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {
            
            /*
                La imagen ha sido cargada con éxito en
                cloudinary Entonces no necesitamos una imagen local
                archivar más
                Eliminar archivo de la carpeta de cargas locales
            */
            fs.unlinkSync(locaFilePath);
  
            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {
  
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}
  
function buildSuccessMsg(urlList) {
  
    
// Construyendo mensaje de éxito para mostrar en pantalla
    var response = `<h1>
                   <a href="/">Click to go to Home page</a><br>
                  </h1><hr>`;
    /*
        Iterando sobre urls de imágenes y creando bases
        html para renderizar imágenes en pantalla
    */
    for (var i = 0; i < urlList.length; i++) {
        response += "File uploaded successfully.<br><br>";
        response += `FILE URL: <a href="${urlList[i]}">
                    ${urlList[i]}</a>.<br><br>`;
        response += `<img src="${urlList[i]}" /><br><hr>`;
    }
  
    response += `<br>
<p>Now you can store this url in database or 
  // do anything with it  based on use case.</p>
`;
    return response;
}
  
app.post(
    "/profile-upload-single",
    upload.single("profile-file"),
    async (req, res, next) => {
  
        /*
            req.file es el archivo `profile-file`
            req.body contendrá los campos de texto,
            si hubiera alguno
  
            req.file.path tendrá la ruta de la imagen
            almacenado en la carpeta de subidas
        */
        var locaFilePath = req.file.path;
  
        /*
            Sube la imagen local a Cloudinary
            y obtener la URL de la imagen como respuesta
        */
        var result = await uploadToCloudinary(locaFilePath);
  
       
        // Generar html para mostrar imágenes en la página web.
        var response = buildSuccessMsg([result.url]);
  
        return res.send(response);
    }
);
  
app.post(
    "/profile-upload-multiple",
    upload.array("profile-files", 12),
    async (req, res, next) => {
        /*
            req.files es una matriz de archivos `profile-files`
            req.body contendrá los campos de texto,
            si hubiera alguno
        */
        var imageUrlList = [];
  
        for (var i = 0; i < req.files.length; i++) {
            var locaFilePath = req.files[i].path;
  
           /*
                Sube la imagen local a Cloudinary
                y obtener la URL de la imagen como respuesta
            */
            var result = await uploadToCloudinary(locaFilePath);
            imageUrlList.push(result.url);
        }
  
        var response = buildSuccessMsg(imageUrlList);
  
        return res.send(response);
    }
);
  
app.listen(port, () => {
    console.log(`Server running on port ${port}!
            \nClick http://localhost:3000/`);
});