import { Router, Request, Response, NextFunction } from "express";

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
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

const router = Router();

router.get("/login", (req: Request, res: Response) => {
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

router.post("/login", (req: RequestWithBody, res: Response) => {
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
  if (
    email &&
    password &&
    email === "hello@hi.com" &&
    password === "password"
  ) {
    req.session = { loggedIn: true };

    res.status(201).redirect("/");
  }
  return res.status(402).json({
    error: "You must provide an email address",
  });
});

router.get("/", (req: Request, res: Response) => {
  if (req.session?.loggedIn) {
    res.status(201).send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `);
  } else {
    return res.status(401).send(`
      <div>
        <p>You are not Log in. Please  <a href="/login">Log In</a>.</p>
      </div>
    `);
  }
});

router.get("/logout", (req: Request, res: Response) => {
  req.session = undefined;
  res.status(404).redirect("/");
});

router.get("/protected", requireAuth, (req: Request, res: Response) => {
  res.status(201).send(`
  <div>You are protected. Welcome !</div>
  `);
});

export { router };
