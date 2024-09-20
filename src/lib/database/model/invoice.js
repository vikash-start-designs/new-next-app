import { type } from "os";

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    invoice : {type:String, required:true},
    rows: [
      {
        item: { type: String, required: true },
        description: { type: String, required: true },
        unitCost: { type: Number, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal : {type: Number},
    taxAmount : {type: Number},
    advanceDeposite: {type: Number},
    taxParcentage : {type: Number},
    total: { type: Number },
    dueBalance : {type: Number}
  },
  { timestamps: true }
);

export const Invoice =
  mongoose.models.invoices || mongoose.model("invoices", invoiceSchema);
