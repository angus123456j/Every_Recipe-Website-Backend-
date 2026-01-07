
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
    const{username, confirmationcode, password} = req.body
    console.log("ConfirmSignUp request - Username:", username, "Has password:", !!password, "Password length:", password?.length || 0)
    
    // Confirm the signup first
    await authService.confirmSignUp({username,confirmationcode})
    console.log("Signup confirmed successfully for:", username)

    // After successful confirmation, automatically log the user in
    if (password) {
        console.log("Auto-logging in user after confirmation:", username);
        const result = await authService.login({ username, password });

        // Cognito returns tokens under AuthenticationResult
        const tokens = result.AuthenticationResult;
        console.log("Username is:", username);
        console.log("Tokens received:", tokens);
        
        req.session.userInfo = {
            username,
            idToken: tokens.IdToken,
            accessToken: tokens.AccessToken,
            refreshToken: tokens.RefreshToken,
        };
        console.log("info stored in session:", req.session);

        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session save failed' });
            }

            console.log("Session saved successfully after confirmation");
            console.log("Session ID:", req.sessionID);
            console.log("Session data:", req.session);
            console.log("Set-Cookie header will be:", `connect.sid=${req.sessionID}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400`);
            
            res.status(201).json({ 
                message: "Confirmed signup and successfully logged in", 
                user: req.session.userInfo,
                sessionId: req.sessionID // Include for debugging
            });
        });
    } else {
        // If no password provided, just confirm (for backward compatibility)
        console.log("WARNING: No password provided in confirmSignUp for user:", username, "- User will need to log in manually")
        res.status(201).json({message: "Confirmed signup. Please log in."})
    }

    } catch (err){
        console.error("Confirm signup error:", err);
        res.status(400).json({error: err.message})

    }

}

exports.login = async(req,res) => {
    try{
        const { username, password } = req.body;
        const result = await authService.login({ username, password });

        // Cognito returns tokens under AuthenticationResult
        const tokens = result.AuthenticationResult;
        console.log("Username is:", username);
        console.log("Tokens received:", tokens);
        
        req.session.userInfo = {
            username,
            idToken: tokens.IdToken,
            accessToken: tokens.AccessToken,
            refreshToken: tokens.RefreshToken,
        };
        console.log("info stored in session:", req.session);

       req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session save failed' });
            }

            console.log("Session saved successfully");
            console.log("Session ID:", req.sessionID);
            console.log("Session data:", req.session); // userInfo should appear here
            console.log("Set-Cookie header will be:", `connect.sid=${req.sessionID}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400`);
            
            res.status(200).json({ 
                message: "Successfully logged in", 
                user: req.session.userInfo,
                sessionId: req.sessionID // Include for debugging
            });
        });


    } catch(err) {
        res.status(401).json({ error: err.message });
    }
}

// ...existing code...

exports.checkAuthStatus = async(req,res) => {
    try {
        console.log("=== checkAuthStatus ===");
        console.log("Session ID:", req.sessionID);
        console.log("Cookies received:", req.headers.cookie);
        console.log("Session:", req.session);
        console.log("userinfo", req.session.userInfo);
        console.log("Session keys:", Object.keys(req.session || {}));
        
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



