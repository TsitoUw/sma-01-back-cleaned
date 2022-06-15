const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { errServer, errException } = require("../shared/status");

const imageUploader = (field, storagePath) => {
	const storage = multer.diskStorage({
		destination: storagePath,
		filename: (req, file, cb) => {
			cb(null, `${uuidv4()}${path.extname(file.originalname.toLowerCase())}`);
		},
	});

	const limits = { fieldSize: 5000000 };

	const fileFilter = (req, file, cb) => {
		const allowedExt = /jpg|jpeg|png|gif/i;
		const extIsCorrect = allowedExt.test(path.extname(file.originalname));
		const mimeTypeIsCorrect = allowedExt.test(file.mimetype);

		if (extIsCorrect && mimeTypeIsCorrect) cb(null, true);
		else cb(new Error("Image are only allowed"));
	};

  return (req, res, next) => {
    const uploader = multer({storage, limits, fileFilter}).single(field);

    uploader(req, res, (err)=>{
      if(err){
        if(err instanceof multer.MulterError) return next(err);
        else return errServer();
      }
      if(!req.file) return errException("You should give a picture");
      next();
    })
  }
};

module.exports = imageUploader;
