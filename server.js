const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const Stripe = require("stripe");

dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Resume Builder API",
      version: "1.0.0",
      description: "API Documentation for Resume Builder Authentication",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.get("/", (req, res) => {
  res.send("Running successfully");
});

// Stripe Payment Intent Route
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { price } = req.body;

    if (!price) {
      return res.status(400).send({ error: "Price is required" });
    }

    const amount = parseInt(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
