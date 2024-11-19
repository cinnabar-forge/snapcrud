import express from "express";
import helmet from "helmet";

import { logIncomingRequests } from "./middleware/logger.js";
import routes from "./routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());

app.use(logIncomingRequests);

app.use("/", routes);

app.use((req: express.Request, res: express.Response) => {
  res.redirect("/");
});

export default app;
