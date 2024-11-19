import "dotenv/config";
import { getStartupWelcomeText } from "@cinnabar-forge/utils";

import app from "./express.js";
import { logger } from "./utils/logger.js";
import { getProjectVersion } from "./utils/version.js";

const host = process.env.HOST || "127.0.0.1";
const port = parseInt(process.env.PORT || "3000");

app.listen(port, host, () => {
  logger.info(
    getStartupWelcomeText(
      "cinnabar-id",
      getProjectVersion(),
      process.env.NODE_ENV === "production",
      "http",
      port,
      null,
    ),
  );
});
