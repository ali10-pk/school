import express from "express";
import { AddNewStudent } from "../controllers/AddNewStudent.js";
import { GetAllStudents } from "../controllers/GetStudents.js";
import { GetStudentByID } from "../controllers/GetStudentbyId.js";
import { AdminDashboard } from "../controllers/Dashboard.js";
import { CollectFee } from "../controllers/CollectFee.js";
import { GetFee } from "../controllers/GetFeeStatus.js";
import { UpdateStudentRecord } from "../controllers/UpdateStudent.js";
import { GetStudentByAdmissionNo } from "../controllers/SearchStudent.js";
import { DeleteStudent } from "../controllers/DeleteStudent.js";

const router = express.Router();


router.post("/", AddNewStudent);
router.get("/", GetAllStudents);
router.get("/:id", GetStudentByID);
router.put("/update/:id", UpdateStudentRecord);
router.get("/search/:admissionNo", GetStudentByAdmissionNo);
router.delete("/delete/:id", DeleteStudent);
router.post("/fee", CollectFee);
router.get("/fee/all", GetFee);
router.get("/dashboard/all", AdminDashboard);

export default router;