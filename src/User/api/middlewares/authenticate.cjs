module.exports = (req, res, next) => {
	const jwt = require("jsonwebtoken");
	const authConfig = require("../../config/auth.json");
	console.log("middleware");
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({
			error: true,
			message: "Token no provided."
		});
	}
	// formato de token jwt
	//Bearer tokenaqui
	const parts = authHeader.split(" ");
	if (parts.length !== 2) {
		return res.status(401).json({
			error: true,
			message: "Invalid Token Type."
		});
	}
	const [scheme, token] = parts;
	if (scheme.indexOf("Bearer") !== 0) {
		return res.status(401).json({
			error: true,
			message: "Token malformatted."
		});
	}
	return jwt.verify(token, authConfig.secret, (err, decoded) => {
		if (err) {
			console.log("ERROR IN VERIFY => \n", err);
			return res.status(401).json({
				error: true,
				message: "Token invalid or expired."
			});
		}
		req.userLogged = decoded;
		console.log("decoded => \n", decoded);
		return next();
	});
};
