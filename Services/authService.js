const AWS = require('aws-sdk')
const crypto = require("crypto")

const userPoolID = process.env.COGNITO_USERPOOLID
const clientID = process.env.COGNITO_CLIENTID
const clientSecret = process.env.COGNITO_CLIENTSECRET

// Debug: Log environment variables (remove in production)
console.log('Auth Service - Environment Variables:');
console.log('UserPoolID:', userPoolID ? 'Set' : 'Not Set');
console.log('ClientID:', clientID ? 'Set' : 'Not Set');
console.log('ClientSecret:', clientSecret ? 'Set' : 'Not Set');
console.log('AWS Region:', process.env.AWS_REGION);

const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION})

function calculateSecretHash(username){
    return crypto.createHmac('sha256',clientSecret).update(username+clientID).digest('base64')
};


exports.signUp = async({username, password, email}) => {
    console.log("service")
    const params = {
        ClientId: clientID,
        Username: username,
        Password: password,
        UserAttributes: [{Name: "email", Value: email}],
        SecretHash: calculateSecretHash(username)
    }

    return cognito.signUp(params).promise()

};

exports.confirmSignUp = async({username,confirmationcode}) => {
    console.log("confirmed")

    const params = {
        ClientId: clientID,
        Username: username,
        ConfirmationCode: confirmationcode,
        SecretHash: calculateSecretHash(username)

    }

    return cognito.confirmSignUp(params).promise()

};

exports.login = async({username,password}) => {
    console.log("Login attempt for username:", username);
    console.log("Using ClientID:", clientID);
    console.log("Using AWS Region:", process.env.AWS_REGION);
    
    try {
        const params = {
            ClientId: clientID,
            AuthFlow: "USER_PASSWORD_AUTH",
            AuthParameters: {USERNAME: username,PASSWORD: password, SECRET_HASH:calculateSecretHash(username) }
        }
        
        console.log("Login params:", JSON.stringify(params, null, 2));
        
        const result = await cognito.initiateAuth(params).promise();
        console.log("Login successful for:", username);
        return result;
        
    } catch (error) {
        console.error("Login error for username:", username);
        console.error("Error details:", error.message);
        console.error("Error code:", error.code);
        throw error;
    }
};

exports.forgotPassword = async({username}) => {
    console.log("Forgot password for username:", username);
    
    const params = {
        ClientId: clientID,
        Username: username,
        SecretHash: calculateSecretHash(username)
    };
    
    return cognito.forgotPassword(params).promise();
};

exports.confirmForgotPassword = async({username, confirmationCode, newPassword}) => {
    console.log("Confirm forgot password for username:", username);
    
    const params = {
        ClientId: clientID,
        Username: username,
        ConfirmationCode: confirmationCode,
        Password: newPassword,
        SecretHash: calculateSecretHash(username)
    };
    
    return cognito.confirmForgotPassword(params).promise();
};