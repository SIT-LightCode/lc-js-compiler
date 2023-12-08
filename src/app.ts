import express, { Express, Request, Response } from "express";
import compileJS from "./services/JsCompiler";
import cors from "cors";

const bodyParser = require("body-parser").json();
const app: Express = express();

const port: number = 8000;
app.use(bodyParser);

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello Express + TypeScirpt!!",
  });
});

app.post("/compilers/js", (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const { code, params } = req.body;
    const result = compileJS(code, params);
    res.json({
      message: result,
    });
  } catch (error) {
    // Check if 'error' is an instance of 'Error' before accessing 'message'
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      // If it's not an 'Error', handle it differently or provide a generic message
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});
app.listen(port, () => console.log(`Application is running on port ${port}`));

export default app;
