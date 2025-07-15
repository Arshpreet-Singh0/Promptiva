import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

import authRoutes from "./routes/auth.routes";
import personRoutes from "./routes/person.routes"
import serviceRoutes from "./routes/service.route";
import { PORT } from "./utils/constant";


//cors

const allowedOrigins = process.env.ALLOWED_CLIENTS?.split(',') || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
//middleware's

app.use(express.json());
app.use(cookieParser());

//api's

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/person', personRoutes);
app.use('/api/v1/service', serviceRoutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
})