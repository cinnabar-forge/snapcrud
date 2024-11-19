import { CINNABAR_PROJECT_VERSION } from "../cinnabar.js";

const version =
  CINNABAR_PROJECT_VERSION + (process.env.ANCA_BUILD_PREFIX || "");

/**
 *
 */
export function getProjectVersion() {
  return version;
}
