import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { listWebhooks } from "./routes/list-webhooks";
import { env } from "./env";
import { getWebhook } from "./routes/get-webhook";
import { deleteWebhook } from "./routes/delete-webhook";
import { captureWebhook } from "./routes/capture-webhook";
import { openApiDocumentation } from "./docs/into.docs";
import { generateHandler } from "./routes/generate-handler";

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
});

app.register(swagger, {
  ...openApiDocumentation,
  transform: jsonSchemaTransform,
});

app.register(scalarApiReference, {
  routePrefix: "/docs",
});

app.register(captureWebhook);
app.register(listWebhooks);
app.register(getWebhook);
app.register(deleteWebhook);
app.register(generateHandler);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running on http://localhost:3333");
  console.log("DOCS available at http://localhost:3333/docs");
});
