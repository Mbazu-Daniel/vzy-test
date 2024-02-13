import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();
const outputFile = "./swagger.json";
const endpointsFiles = ["./*/*.routes.js"];


const config = {
  info: {
    title: "VZY API Documentation",
    description:
      "VZY USER AND STRIPE PAYMENT DOCUMENTATION",
    version: "1.0.0",
  },

  servers: [
    {
      url: "http://localhost:8000/",
      description: "local testing server",
    },
    {
      url: "https://vzy-test.onrender.com/",
      description: "render testing server",
    },
  ],
  tags: [
    "Auth",
    "Users",
    "Stripe",
  ],

//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: "http",
//         scheme: "bearer",
//       },
//     },

//     schemas: {
//       LoginRequest: {
//         $email: "example@gmail.com",
//         $password: "password",
//       },
//     },
//   },
  schemes: ["http", "https"],
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, config);
