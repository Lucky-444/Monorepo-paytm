import express from "express";
import { z } from "zod";
import db from "@repo/db/client";

const app = express();
app.use(express.json());

const webhookSchema = z.object({
  token: z.string(),
  user_identifier: z.string(),
  amount: z.number(),
});

app.post("/hdfcWebhook", async (req, res) => {
  try {
    // Validate webhook payload
    const parsedData = webhookSchema.parse(req.body);

    const paymentInformation = {
      token: parsedData.token,
      userId: Number(parsedData.user_identifier),
      amount: parsedData.amount,
    };

    // Prisma Transaction (Atomic)
    await db.$transaction([
      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.status(200).json({
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error);

    res.status(500).json({
      error: "Transaction failed. Rolled back.",
    });
  }
});
