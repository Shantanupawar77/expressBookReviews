const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

// Setup session management
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Token verification middleware
app.use("/customer/auth/*", (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, '1234567890', (err, user) => {
        if (err) return res.sendStatus(403);
        req.username = user.username;
        next();
    });
});

const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
