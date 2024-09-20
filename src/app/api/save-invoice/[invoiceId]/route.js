import { connection } from "@/lib/database/db_connection";
import { Invoice } from "@/lib/database/model/invoice";
import { NextResponse } from "next/server";

export const GET = async (req, value) => {
  try {
    const invId = value.params.invoiceId;
    console.log("id----", invId);

    connection();

    const getIncoice = await Invoice.findById({ _id: invId });

    return NextResponse.json({
      data: getIncoice,
      status: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Internal Server Error",
      Error: error.message,
    });
  }
};

export const PUT = async (req, value) => {
  try {
    connection();
    const invId = value.params.invoiceId;
    const invoiceData = await req.json();

    console.log("invoiceData--->", invoiceData)
    const rows = invoiceData.rows.map((row) => ({
      item: row.item,
      description: row.description,
      unitCost: Number(row.unitCost),
      quantity: Number(row.quantity),
      price: Number(row.price),
    }));

    console.log("rows--->", rows);
    const payload = {
      to: rows.to,
      invoice: rows.invoice,
      rows: rows,
      subtotal: invoiceData.subtotal,
      taxAmount : invoiceData.taxAmount.toFixed(2),
      advanceDeposite: invoiceData.deposite,
      taxParcentage: invoiceData.taxPercentage,
      dueBalance: invoiceData.dueBalance.toFixed(2),
      total: invoiceData.totalPrice,
    };
    console.log("newInvoice", payload);

    const updateInvoice = await Invoice.findByIdAndUpdate(
      { _id: invId },
      payload
    );
    console.log("updateInvoice", updateInvoice);

    return NextResponse.json({
      result: updateInvoice,
      status: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Internal Server Error",
      Error: error.message,
    });
  }
};

export const DELETE = async (req, value)=>{
  try {
    connection();
    const invId = value.params.invoiceId;
    
    console.log("invId-->>>", invId);
    let deletedInvoice = await Invoice.findByIdAndDelete({_id: invId});
    console.log("deletedInvoice", deletedInvoice);

    return NextResponse.json({
      result: deletedInvoice,
      status: true,
    });

  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Internal Server Error",
      Error: error.message,
    });
  }
}
