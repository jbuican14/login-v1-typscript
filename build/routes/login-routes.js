"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
function requireAuth(req, res, next) {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }
    res.status(403).json({
        message: {
            error: "Not permitted",
        },
    });
}
const router = (0, express_1.Router)();
exports.router = router;
router.get("/login", (req, res) => {
    res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input name="email" />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" />
      </div>
      <button>Log in</button>
    </form>
  `);
});
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    // if(email) {
    //   res.status(201).json({
    //     message: {
    //       email,
    //       password
    //     }
    //   })
    // }
    // hardcode to just simplify the log-in for the purpose of demo on typescript
    if (email &&
        password &&
        email === "hello@hi.com" &&
        password === "password") {
        req.session = { loggedIn: true };
        res.status(201).redirect("/");
    }
    return res.status(402).json({
        error: "You must provide an email address",
    });
});
router.get("/", (req, res) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.loggedIn) {
        res.status(201).send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `);
    }
    else {
        return res.status(401).send(`
      <div>
        <p>You are not Log in. Please  <a href="/login">Log In</a>.</p>
      </div>
    `);
    }
});
router.get("/logout", (req, res) => {
    req.session = undefined;
    res.status(404).redirect("/");
});
router.get("/protected", requireAuth, (req, res) => {
    res.status(201).send(`
  <div>You are protected. Welcome !</div>
  `);
});
