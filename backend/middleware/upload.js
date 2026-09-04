const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// DOSSIER PUBLIC
// C:\hotelia\public
// =====================================================

const publicPath = path.join(__dirname, "../../public");

// إنشاء dossier public إذا ما فماش
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, {
        recursive: true
    });
}


// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, publicPath);

    },

    filename: (req, file, cb) => {

        // نحافظ على extension
        const extension =
            path.extname(file.originalname);

        // اسم unique
        const filename =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            extension;

        cb(null, filename);

    }

});


// =====================================================
// FILTER IMAGE
// =====================================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Seules les images JPG, JPEG, PNG et WEBP sont autorisées."
            ),
            false
        );

    }

};


// =====================================================
// MULTER
// =====================================================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


module.exports = upload;