export const areCredentialsPresent = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("No email or password provided.");
    }
    next();
}