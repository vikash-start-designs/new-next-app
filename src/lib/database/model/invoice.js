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
    total: { type: Number },
  },
  { timestamps: true }
);

export const Invoice =
  mongoose.models.invoices || mongoose.model("invoices", invoiceSchema);
