const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "uploads/");
	},
	filename: (req, file, callback) => {
		const time = new Date().getTime();
		callback(null, `${time}_${path.extname(file.originalname)}`);
	}
});

const upload = multer({ storage });

module.exports = upload;
