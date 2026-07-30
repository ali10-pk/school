import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Unpaid",
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank", "JazzCash", "EasyPaisa"],
      default: "Cash",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    // Student Information
    admissionNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // School Register Serial Number (سلسلہ نمبر)
    salsalaNo: {
      type: String,
      unique: true,
      trim: true,
      default: "",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    guardianName: {
      type: String,
      default: "",
      trim: true,
    },

    BForm: {
      type: String,
      default: "",
      trim: true,
    },

    fatherCNIC: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },

    DOB: {
      type: Date,
    },

    phoneNo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // Academic Information
    className: {
      type: String,
      enum: [
        "Play Group",
        "Nursery",
        "Prep",
        "One Class",
        "Two Class",
        "Three Class",
        "4th Class",
        "5th Class",
        "6th Class",
        "7th Class",
        "8th Class",
        "9th Class",
        "10th Class",
        "11th Class",
        "12th Class",
      ],
      required: true,
    },

    section: {
      type: String,
      default: "A",
    },

    session: {
      type: String,
      required: true,
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    // Dakhala Kharij Date (Date when student leaves the school)
    dakhalaKharijDate: {
      type: Date,
      default: null,
    },

    // Fee Collection
    fees: [feeSchema],

    // Student Status
    status: {
      type: String,
      enum: ["Active", "Inactive", "Left"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);