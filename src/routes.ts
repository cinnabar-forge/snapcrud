import express from "express";

import routeCreateTableEntity from "./controllers/createTableEntity.js";
import routeDeleteTableEntity from "./controllers/deleteTableEntity.js";
import routeGetTableCreateEntityPage from "./controllers/getTableCreateEntityPage.js";
import routeGetTableEntitiesPage from "./controllers/getTableEntitiesPage.js";
import routeGetTablesPage from "./controllers/getTablesPage.js";
import routeGetTableUpdateEntityPage from "./controllers/getTableUpdateEntityPage.js";
import routeUpdateTableEntity from "./controllers/updateTableEntity.js";

const router = express.Router();

router.get("/tables/:tableName", routeGetTableEntitiesPage);
router.get("/tables/:tableName/create", routeGetTableCreateEntityPage);
router.get("/tables/:tableName/update", routeGetTableUpdateEntityPage);
router.get("/", routeGetTablesPage);
router.post("/tables/:tableName/create", routeCreateTableEntity);
router.post("/tables/:tableName/update", routeUpdateTableEntity);
router.post("/tables/:tableName/delete", routeDeleteTableEntity);

export default router;
