import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

import authRoutes from "./routes/auth.routes";
import { PORT } from "./utils/constant";

app.use(express.json());
app.use(cookieParser());



//api's

app.use('/api/v1/auth', authRoutes);

// import { generateText } from "ai";
// import { openrouter } from "@openrouter/ai-sdk-provider";
// import { SERVICE_REQUEST_PROMPT } from "./utils/prompt";

// async function call() {
//   const { text } = await generateText({
//     model: openrouter("anthropic/claude-3-haiku"),
//     prompt : SERVICE_REQUEST_PROMPT("email to book meeting at 10 AM on 13 july 2025 with riya")
//   });

//   console.log("AI Response:\n", JSON.parse(text));
// }

// call();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
})