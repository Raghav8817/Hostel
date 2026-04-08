const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = decoded; // This makes req.user.username available
        next();
    });
};

module.exports = { verifyAdmin };
