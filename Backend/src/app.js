import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth/auth.routes.js";
import sessionRoutes from "./routes/master/session/session.routes.js";
import boardRoutes from "./routes/master/board/board.routes.js";
import classRoutes from "./routes/master/Class/class.routes.js";
import sectionRoutes from "./routes/master/section/section.routes.js";
import streamRoutes from "./routes/master/stream/stream.routes.js";
import classMappingRoutes from "./routes/master/classMapping/classMapping.routes.js";
import subjectRoutes from "./routes/master/subject/subject.routes.js";
import addSubjectToClassRoutes from "./routes/master/addSubjectToClass/addSubjectToClass.routes.js";
import subjectTopicRoutes from "./routes/master/createTopicInSubject/subjectTopic.routes.js";
import subjectMarksConfigRoutes from "./routes/master/subjectMarksConfig/subjectMarksConfig.routes.js";
import feeTypeRoutes from "./routes/master/feeType/feeType.routes.js";
import remarkRoutes from "./routes/master/remarks/remarks.routes.js";
import schoolRoutes from "./routes/master/school/school.routes.js";
import paymentInfoRoutes from "./routes/master/paymentInfo/paymentInfo.routes.js";
import studentRoutes from "./routes/academic/addNewStudent/student.routes.js";
import studentAcademicMappingRoutes from "./routes/academic/studentAcademicMapping/studentAcademicMapping.route.js";
import academicCalendarRoutes from "./routes/academic/academicCalender/academicCalendar.routes.js";
import weeklyPlanRoutes from "./routes/academic/weeklyPlan/weeklyPlan.routes.js";
import studentAttendanceRoutes from "./routes/academic/studentAttendance/studentAttendance.routes.js";


const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadsPath = path.resolve(__dirname, "../uploads");

console.log("Uploads serving from:", uploadsPath);;

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// const allowedOrigins = [
//     "http://localhost:5173",
//     "http://192.168.1.26:5173",
//     "http://192.168.1.26:5173",
// ];

// app.use(
//     cors({
//         origin: (origin, callback) => {
//             // Postman ya mobile apps ke liye
//             if (!origin) return callback(null, true);

//             if (allowedOrigins.includes(origin)) {
//                 return callback(null, true);
//             }

//             return callback(new Error(`CORS blocked: ${origin}`));
//         },
//         credentials: true,
//     })
// );

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads")),
);

app.use("/api/auth", authRoutes);
app.use("/api/master/sessions", sessionRoutes)
app.use("/api/boards", boardRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/streams", streamRoutes);
app.use("/api/class-mappings", classMappingRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/class-subjects", addSubjectToClassRoutes);
app.use("/api/subject-topics", subjectTopicRoutes);
app.use("/api/subject-marks-configs", subjectMarksConfigRoutes);
app.use("/api/fee-types", feeTypeRoutes);
app.use("/api/remarks", remarkRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/payment-info", paymentInfoRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/student-academic-mappings", studentAcademicMappingRoutes,);
app.use("/api/academic-calendars", academicCalendarRoutes);
app.use("/api/weekly-plans", weeklyPlanRoutes);
app.use("/api/student-attendances", studentAttendanceRoutes);

app.get("/", (req, res) => {
    res.send("School ERP Backend Running");
});

export default app;