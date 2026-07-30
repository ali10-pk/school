import Student from "../models/student.model.js";

export const AddNewStudent = async (req, res) => {
  try {
    const {
      admissionNo,
      salsalaNo,
      name,
      fatherName,
      guardianName,
      BForm,
      fatherCNIC,
      gender,
      DOB,
      phoneNo,
      address,
      className,
      section,
      session,
      joiningDate,
      monthlyFee,
    } = req.body;

    // ===========================
    // Required Fields Validation
    // ===========================
    if (
      !admissionNo ||
      !name ||
      !fatherName ||
      !className ||
      !session
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Admission No, Name, Father Name, Class and Session are required.",
      });
    }

    // ===========================
    // Duplicate Admission Number
    // ===========================
    const admissionExists = await Student.findOne({ admissionNo });

    if (admissionExists) {
      return res.status(400).json({
        success: false,
        message: "Admission Number already exists.",
      });
    }

    // ===========================
    // Duplicate Salsala No
    // ===========================
    if (salsalaNo) {
      const salsalaExists = await Student.findOne({ salsalaNo });

      if (salsalaExists) {
        return res.status(400).json({
          success: false,
          message: "Salsala Number already exists.",
        });
      }
    }

    // ===========================
    // Create Fee Array
    // ===========================
    let fees = [];

    if (monthlyFee && Number(monthlyFee) > 0) {
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      fees.push({
        month: currentMonth,
        amount: Number(monthlyFee),
        paidAmount: 0,
        remainingAmount: Number(monthlyFee),
        status: "Unpaid",
      });
    }

    // ===========================
    // Create Student
    // ===========================
    const student = await Student.create({
      admissionNo: admissionNo.trim(),
      salsalaNo: salsalaNo?.trim() || "",
      name: name.trim(),
      fatherName: fatherName.trim(),
      guardianName: guardianName?.trim() || "",
      BForm: BForm?.trim() || "",
      fatherCNIC: fatherCNIC?.trim() || "",
      gender,
      DOB,
      phoneNo: phoneNo?.trim() || "",
      address: address?.trim() || "",
      className,
      section: section || "A",
      session,
      joiningDate: joiningDate || new Date(),
      fees,
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Student admitted successfully.",
      student,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};