import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

import authRoutes from "./routes/auth.routes";
import personRoutes from "./routes/person.routes"
import serviceRoutes from "./routes/service.route";
import { PORT } from "./utils/constant";

app.use(express.json());
app.use(cookieParser());



//api's

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/person', personRoutes);
app.use('/api/v1/service', serviceRoutes);


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