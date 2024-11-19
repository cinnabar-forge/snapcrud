import express from "express";

import routeGetTableEntities from "./controllers/getTableEntities.js";
import routeGetTableEntity from "./controllers/getTableEntity.js";
import routeGetTables from "./controllers/getTables.js";
import routeUpdateTableEntity from "./controllers/updateTableEntity.js";

const router = express.Router();

router.get("/tables/:tableName", routeGetTableEntities);
router.get("/tables/:tableName/entity", routeGetTableEntity);
router.get("/", routeGetTables);
router.post("/tables/:tableName/entity", routeUpdateTableEntity);

export default router;
