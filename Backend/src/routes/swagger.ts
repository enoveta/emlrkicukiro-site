import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { openApiSpec } from "../swagger/openapi";

export const swaggerRouter = Router();

swaggerRouter.use(swaggerUi.serve);
swaggerRouter.get("/", swaggerUi.setup(openApiSpec));
