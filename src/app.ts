import express from "express";
import cors from "cors";
import enquiryRoutes from "./routes/enquiryRoutes";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import roleRoutes from "./routes/roleRoutes";
import userRoutes from "./routes/userRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";



const app = express();

app.use(express.json());
app.use(cors());

app.use("/enquiries", enquiryRoutes);
app.use("/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/roles",roleRoutes);
app.use("/users",userRoutes);
app.use("/api/assessments", assessmentRoutes);


app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    data: null
  });
});

export default app;