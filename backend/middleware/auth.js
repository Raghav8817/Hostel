const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        const isAdmin = decoded.role === 'admin' || decoded.role === 'admins';
        if (!isAdmin) return res.status(403).json({ message: "Access denied: Admins only" });
        req.user = decoded; 
        next();
    });
};

const verifyStaff = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        if (decoded.role === 'student') return res.status(403).json({ message: "Access denied: Staff/Admit only" });
        req.user = decoded;
        next();
    });
};

module.exports = { verifyAdmin, verifyStaff };
