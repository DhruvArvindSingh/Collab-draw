import insert_user from "../database/utils/insert_user.js";
export default async function signup_post(req, res) {
    console.log("POST /signup received");
    const { username, email, password, public_key, private_key } = req.body;
    try {
        // Insert user into the database
        const user = await insert_user(username, email, password);
        console.log("Signup successful for:", user);
        // Redirect to the signin page
        res.status(200).json({ message: "Signup successful" });
    }
    catch (e) {
        console.error("An error occurred during signup:", e);
        // Respond with an error message
        res.status(500).json({ error: "Signup failed. Please try again later." });
    }
}
