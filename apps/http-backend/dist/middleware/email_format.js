export default function email_format(req, res, next) {
    console.log("email_format middleware called");
    console.log("req.body = ", req.body);
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) ? next() : res.status(401).json({ message: "Invalid email format" });
}
