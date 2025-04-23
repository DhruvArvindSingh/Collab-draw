export default function pass_format(req, res, next) {
    console.log("req.body =", req.body);
    console.log("pass_format =", req.body.password);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    (passwordRegex.test(req.body.password)) ? next() : res.status(401).json({ message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
}
