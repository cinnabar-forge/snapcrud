import "dotenv/config";
import { getStartupWelcomeText } from "@cinnabar-forge/utils";

import app from "./express.js";
import { logger } from "./utils/logger.js";
import { getProjectVersion } from "./utils/version.js";

const host = process.env.SNAPCRUD_HOST || "127.0.0.1";
const port = parseInt(process.env.SNAPCRUD_PORT || "3000");

app.listen(port, host, () => {
  logger.info(
    getStartupWelcomeText(
      "snapcrud",
      getProjectVersion(),
      process.env.NODE_ENV === "production",
      "http",
      port,
      null,
    ),
  );
});
