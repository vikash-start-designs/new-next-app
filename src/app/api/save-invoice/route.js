import { NextResponse } from "next/server";
import { connection } from "@/lib/database/db_connection";
import { Invoice } from "@/lib/database/model/invoice";

export const POST = async (req) => {
  try {
    connection();
    const payload = await req.json();

    const rows = payload.rows.map((row) => ({
      item: row.item,
      description: row.description,
      unitCost: Number(row.unitCost),
      quantity: Number(row.quantity),
      price: Number(row.price),
    }));
    console.log("rows--->", rows);
    const newInvoice = new Invoice({
      from : payload.from,
      to: payload.to,
      invoice : payload.invoice,
      logoImage :payload.logo,
      rows: rows,
      subtotal: payload.subtotal,
      taxAmount : payload.taxAmount.toFixed(2),
      advanceDeposite: payload.deposite,
      taxParcentage : payload.taxPercentage,
      dueBalance: payload.dueBalance.toFixed(2),
      total: payload.total.toFixed(),
      notes : payload.notes
    });
    console.log("newInvoice", newInvoice);

    const getNewInvoiceInfo = await newInvoice.save();
    console.log(getNewInvoiceInfo);
    return NextResponse.json({
      data: getNewInvoiceInfo,
      status: true,
      message: "New Invoice Created Successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Internal Server Error",
      Error: error.message,
    });
  }
};

export const GET = async()=>{
  try {
    connection();
    const getAllInvoice = await Invoice.find();
    return NextResponse.json({
      data: getAllInvoice,
      status: true,
      message: "Get all Invoices",
    });
    
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Internal Server Error",
      Error: error.message,
    });
  }
}
