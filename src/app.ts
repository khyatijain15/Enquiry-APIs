import express from "express";
import cors from "cors";
import enquiryRoutes from "./routes/enquiryRoutes";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import roleRoutes from "./routes/roleRoutes";
import userRoutes from "./routes/userRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/enquiries", enquiryRoutes);
app.use("/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/roles", roleRoutes);
app.use("/users", userRoutes);
app.use("/api/assessments", assessmentRoutes);


app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    data: null
  });
});

//global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("GLOBAL ERROR:", err);

  // handle invalid JSON
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      status: false,
      message: "Invalid JSON format",
      data: null
    });
  }

  
  res.status(err.status || 500).json({
    status: false,
    message: err.message || "Internal Server Error",
    data: null
  });
});

export default app;