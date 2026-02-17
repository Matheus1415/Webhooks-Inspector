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

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
});

app.register(swagger, {
  openapi: {
    info: {
      title: "Webhooks Inspector API",
      description: "API para recebimento e inspeção de webhooks",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(scalarApiReference, {
  routePrefix: "/docs",
});

app.register(listWebhooks);
app.register(getWebhook);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running on http://localhost:3333");
  console.log("DOCS available at http://localhost:3333/docs");
});
