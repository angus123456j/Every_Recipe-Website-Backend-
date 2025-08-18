module.exports = (req,res,next) => {
    if (!req.session || !req.session.userInfo){
        return res.status(401).json({error: "unauthorized login"})
    }
    next();
};