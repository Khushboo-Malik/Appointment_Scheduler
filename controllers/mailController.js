const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const OAuth2_client = new OAuth2(clientId, clientSecret);
OAuth2_client.setCredentials({ refresh_token: refreshToken });

async function send_mail_registration(Email, name) {
    try {
        // Check if the access token is expired
        if (OAuth2_client.isTokenExpiring()) {
            // Refresh the access token
            const newAccessToken = await OAuth2_client.refreshAccessToken();
            OAuth2_client.setCredentials({ access_token: newAccessToken.token });
        }

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "mail.khushboomalik@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: OAuth2_client.getAccessToken(),
            },
        });

        const mail_options = {
            from: `Education<${"mail.khushboomalik@gmail.com"}`,
            to: Email,
            subject: "Registration",
            html: get_html_message(name),
        };

        const result = await transport.sendMail(mail_options);
        console.log("Success:", result);
        transport.close();
    } catch (error) {
        console.log("Error:", error);
    }
}

function get_html_message(name) {
    return `<h3>${name}! You have successfully accessed your account!</h3>`;
}

async function send_mail_verification(Email,URL) {
    try {
        // Check if the access token is expired
        if (OAuth2_client.isTokenExpiring()) {
            // Refresh the access token
            const newAccessToken = await OAuth2_client.refreshAccessToken();
            OAuth2_client.setCredentials({ access_token: newAccessToken.token });
        }

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "mail.khushboomalik@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: OAuth2_client.getAccessToken(),
            },
        });

        const mail_options = {
            from: `Education<${"mail.khushboomalik@gmail.com"}`,
            to: Email,
            subject: "Email Verification",
            html: get_html_message_verification(Email,URL),
        };

        const result = await transport.sendMail(mail_options);
        console.log("Success:", result);
        transport.close();
    } catch (error) {
        console.log("Error:", error);
    }
}

function get_html_message_verification(Email,URL) {
    return `
    <h3>Click on this link to verify your email address:<br>
    <p style="color:red; font-size:200%;"><a href="${URL}/user/verifyEmail/${Email}">Verify mail</a></p></h3>`
};

async function send_mail_OTP(Email,OTP) {
    try {
        // Check if the access token is expired
        if (OAuth2_client.isTokenExpiring()) {
            // Refresh the access token
            const newAccessToken = await OAuth2_client.refreshAccessToken();
            OAuth2_client.setCredentials({ access_token: newAccessToken.token });
        }

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "mail.khushboomalik@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: OAuth2_client.getAccessToken(),
            },
        });

        const mail_options = {
            from: `Education<${"mail.khushboomalik@gmail.com"}`,
            to: Email,
            subject: "Reset Password",
            html: get_html_message_OTP(OTP),
        };

        const result = await transport.sendMail(mail_options);
        console.log("Success:", result);
        transport.close();
    } catch (error) {
        console.log("Error:", error);
    }
}

function get_html_message_OTP(OTP) {
    return `<h3>Your OTP is:${OTP}</h3>`
};





module.exports={send_mail_registration,send_mail_verification,send_mail_OTP};


