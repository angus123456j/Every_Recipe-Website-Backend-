
const authService = require('../Services/authService');

exports.signUp = async(req,res) => {
    
    try
    {
    console.log("went into auth Controllers try block")
    const {username, password, email} = req.body
    const result = await authService.signUp({username,password,email})
    
    res.status(201).json({ message: "Succesfully signed up", result })

    } catch (err){

        res.status(400).json({error : err.message })



    }
}

exports.confirmSignUp = async(req,res) => {
    try{
    console.log("went into confirmSignup try block")
    const{username, confirmationcode} = req.body
    await authService.confirmSignUp({username,confirmationcode})

    res.status(201).json({message: "Confirmed signup."})

    } catch (err){
        res.status(400).json({error: err.message})

    }

}

exports.login = async(req,res) => {
    try{
        const { username, password } = req.body;
        const result = await authService.login({ username, password });

        // Cognito returns tokens under AuthenticationResult
        const tokens = result.AuthenticationResult;

        req.session.userInfo = {
            username,
            idToken: tokens.IdToken,
            accessToken: tokens.AccessToken,
            refreshToken: tokens.RefreshToken,
        };

        

        res.status(201).json({ message: "Successfully logged in" });

    } catch(err) {
        res.status(401).json({ error: err.message });
    }
}

// ...existing code...

exports.checkAuthStatus = async(req,res) => {
    try {
        if (req.session && req.session.userInfo) {
            res.json({
                username: req.session.userInfo.username,
                isAuthenticated: true
            });
        } else {
            res.status(401).json({ isAuthenticated: false });
        }
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.logout = async(req,res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({error: "Could not log out"})
            } else {
                res.json({ message: "Successfully logged out" })
            }
        });
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.forgotPassword = async(req, res) => {
    try {
        console.log("Forgot password controller");
        const { username } = req.body;
        const result = await authService.forgotPassword({ username });
        
        res.status(200).json({ 
            message: "Password reset code sent to your email",
            result 
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.confirmForgotPassword = async(req, res) => {
    try {
        console.log("Confirm forgot password controller");
        const { username, confirmationCode, newPassword } = req.body;
        const result = await authService.confirmForgotPassword({ 
            username, 
            confirmationCode, 
            newPassword 
        });
        
        res.status(200).json({ 
            message: "Password successfully reset",
            result 
        });
    } catch (err) {
        console.error("Confirm forgot password error:", err);
        res.status(400).json({ error: err.message });
    }
};



