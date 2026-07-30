import Student from "../models/student.model.js";

export const AdminDashboard = async (req, res) => {
  try {
    // =========================
    // Student Statistics
    // =========================
    const totalStudents = await Student.countDocuments();

    const activeStudents = await Student.countDocuments({
      status: "Active",
    });

    const inactiveStudents = await Student.countDocuments({
      status: "Inactive",
    });

    const leftStudents = await Student.countDocuments({
      status: "Left",
    });

    const boys = await Student.countDocuments({
      gender: "Male",
    });

    const girls = await Student.countDocuments({
      gender: "Female",
    });

    // =========================
    // Today's Admissions
    // =========================
    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const todayAdmissions = await Student.countDocuments({
      joiningDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    // =========================
    // Monthly Admissions
    // =========================
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const monthlyAdmissions = await Student.countDocuments({
      joiningDate: {
        $gte: startOfMonth,
      },
    });

    // =========================
    // Current Month Fee Statistics
    // =========================
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const students = await Student.find({}, { fees: 1 });

    let totalFee = 0;
    let paidFee = 0;
    let remainingFee = 0;

    let paidStudents = 0;
    let unpaidStudents = 0;
    let partialStudents = 0;

    students.forEach((student) => {
      let hasPaid = false;
      let hasUnpaid = false;
      let hasPartial = false;

      student.fees.forEach((fee) => {
        if (fee.month === currentMonth) {
          totalFee += fee.amount;
          paidFee += fee.paidAmount;
          remainingFee += fee.remainingAmount;

          if (fee.status === "Paid") hasPaid = true;
          if (fee.status === "Unpaid") hasUnpaid = true;
          if (fee.status === "Partial") hasPartial = true;
        }
      });

      if (hasPaid) paidStudents++;
      if (hasUnpaid) unpaidStudents++;
      if (hasPartial) partialStudents++;
    });

    // =========================
    // Class Wise Students
    // =========================
    const classWise = await Student.aggregate([
      {
        $group: {
          _id: "$className",
          totalStudents: {
            $sum: 1,
          },
          boys: {
            $sum: {
              $cond: [{ $eq: ["$gender", "Male"] }, 1, 0],
            },
          },
          girls: {
            $sum: {
              $cond: [{ $eq: ["$gender", "Female"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // =========================
    // Dashboard Response
    // =========================
    res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully.",

      students: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        leftStudents,
        boys,
        girls,
      },

      admissions: {
        todayAdmissions,
        monthlyAdmissions,
      },

      fees: {
        month: currentMonth,
        totalFee,
        paidFee,
        remainingFee,
        paidStudents,
        unpaidStudents,
        partialStudents,
      },

      classWise,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard.",
      error: error.message,
    });
  }
};