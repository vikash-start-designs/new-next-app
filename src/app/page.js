
"use client";
import { MdAddCircleOutline } from "react-icons/md";
import Image from "next/image";
import { useState } from "react";
import styles from "./invoice.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [rows, setRows] = useState([
    {
      item: "Web Updates",
      description: "Monthly web updates for http://widgetcorp.com",
      unitCost: 10,
      quantity: 1,
      price: 10,
    },
  ]);

  // Date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // States
  const [to, setTo] = useState("");
  const [invoice, setInvoice] = useState("SD/19-20/09-S001");
  const [subtotal, setSubtotal] = useState(10.0);
  const [taxPercentage, setTaxPercentage] = useState(0); // Percentage
  const [taxAmount, setTaxAmount] = useState(0); // Calculated tax amount
  const [deposite, setDeposite] = useState(0);
  const [dueBalance, setDueBalance] = useState(10.0);
  const [totalPrice, setTotalPrice] = useState(10.0);

  ;
  const handleTO = (toValue) => {
    setTo(toValue);
  };

  const handleInvoice = (invoiceValue) => {
    setInvoice(invoiceValue);
  };

  const calculateTotals = (updatedRows, taxRate = taxPercentage, deposit = deposite) => {
    let newSubtotal = updatedRows.reduce((sum, row) => sum + row.price, 0);
    setSubtotal(newSubtotal);

    let newTaxAmount = (taxRate / 100) * newSubtotal;
    setTaxAmount(newTaxAmount);

    let newTotal = newSubtotal + newTaxAmount;
    setTotalPrice(newTotal);

    let newDueBalance = newTotal - deposit;
    setDueBalance(newDueBalance);
  };

  const handleCostAndQuantityChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];

    const updatedUnitCost =
      name === "unitCost"
        ? parseFloat(value) || 0
        : parseFloat(updatedRows[index].unitCost) || 0;
    const updatedQuantity =
      name === "quantity"
        ? parseFloat(value) || 0
        : parseFloat(updatedRows[index].quantity) || 0;

    const updatedPrice = updatedUnitCost * updatedQuantity;
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
      price: updatedPrice,
    };

    setRows(updatedRows);
    calculateTotals(updatedRows);
  };

  const handleTaxAndDepositChange = (event) => {
    const { name, value } = event.target;
    if (name === "tax") {
      const taxValue = parseFloat(value) || "";
      setTaxPercentage(taxValue);
      calculateTotals(rows, taxValue);
    } else if (name === "deposite") {
      const depositValue = parseFloat(value) || "";
      setDeposite(depositValue);
      calculateTotals(rows, taxPercentage, depositValue);
    }
  };

  const handleAddNewRow = () => {
    setRows([
      ...rows,
      { item: "", description: "", unitCost: "", quantity: "", price: 0 },
    ]);
  };

  const saveInvoice = async () => {
    
    try {
      console.log("deposite--->", deposite);
      console.log("taxxxxx--->", taxPercentage)
      let data = await fetch("http://localhost:3000/api/save-invoice", {
        method: "POST",
        body: JSON.stringify({
          to: to,
          invoice,
          rows,
          subtotal: subtotal,
          taxAmount: taxAmount,
          deposite : deposite,
          taxPercentage: taxPercentage, 
          total: totalPrice,
          dueBalance: dueBalance
        }),
      });

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }
      data = await data.json();

      if (data.status) {
        alert("Invoice is saved successfully");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.invoiceContainer}>
        {/* Header Section */}
        <header className={styles.invoiceHeader}>
          <div className={styles.companyDetails}>
            <h2>START DESIGNS</h2>
            <p>House No. 677 3rd floor Office No. 308 to 311</p>
            <p>chandalal kalyanmal complex</p>
            <p>Kishanpol bazar, Jaipur - 302002</p>
            <p>startdesigns@gmail.com</p>
            <p>GSTIN:- 08ACUFS9062L1Z3</p>
          </div>
          <div className={styles.companyLogo}>
            <Image
              src={require("./public/images.png")}
              alt="GFG logo imported from public directory"
              height="100"
              width="600"
            />
          </div>
        </header>

        {/* Invoice Details */}
        <section className={styles.invoiceDetails}>
          <h1>INVOICE</h1>
          <div className={styles.invoiceInfo}>
            <strong>Invoice #:</strong>{" "}
            <textarea
              style={{ height: "40px" }}
              name="invoice"
              onChange={(event) => handleInvoice(event.target.value)}
            >
              SD/19-20/09-S001
            </textarea>
            <p>
              <strong>Date:</strong>{" "}
              <input type="text" value={` ${day}-${month}-${year}`} />
            </p>
            <p>
              <strong>Amount Due:</strong>
              {`$${dueBalance.toFixed(2)}`}
            </p>
          </div>
        </section>

        {/* Client Details */}
        <section className={styles.clientDetails}>
          <p>
            <strong>To:</strong>
          </p>
          <textarea
            name="to"
            style={{ height: "100px", overflow: "hidden" }}
            onChange={(event) => handleTO(event.target.value)}
          />
        </section>

        {/* Table */}
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Unit Cost</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    placeholder="Enter item"
                    value={row.item}
                    onChange={(e) => handleCostAndQuantityChange(index, e)}
                    name="item"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter Description"
                    value={row.description}
                    onChange={(e) => handleCostAndQuantityChange(index, e)}
                    name="description"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="unitCost"
                    placeholder="Enter Unit Cost"
                    value={row.unitCost}
                    onChange={(e) => handleCostAndQuantityChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={row.quantity}
                    onChange={(e) => handleCostAndQuantityChange(index, e)}
                  />
                </td>
                <td>${row.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Calculation */}
        <div className={styles.invoiceTotal}>
          <div className={styles.addRow}>
            <a><MdAddCircleOutline onClick={handleAddNewRow} /></a>
          </div>
          <table className={styles.summaryTable}>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>{`$${subtotal.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td>Tax (%)</td>
                <td>
                  <input
                    type="number"
                    name="tax"
                    placeholder="Enter Tax"
                    onChange={handleTaxAndDepositChange}
                    value={taxPercentage === "" ? "" : taxPercentage}
                  />
                </td>
              </tr>
              <tr>
                <td>Tax Amount</td>
                <td>{`$${taxAmount.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td>Enter Deposited</td>
                <td>
                  <input
                    type="number"
                    name="deposite"
                    placeholder="Enter Advance Deposited"
                    onChange={handleTaxAndDepositChange}
                    value={deposite === "" ? "" : deposite}
                  />
                </td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{`$${totalPrice.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td>Amount Paid</td>
                <td>{`$${deposite}`}</td>
              </tr>
              <tr className={styles.balanceRow}>
                <td><strong>Balance Due</strong></td>
                <td><strong>{`$${dueBalance.toFixed(2)}`}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <div className={styles.addRow}>
          <button onClick={saveInvoice}> Save Invoice</button>
        </div>

        {/* Listing Button */}
        <div className={styles.addRow}>
          <button className={styles.listingButton} onClick={() => router.push('/listing')}> Listing </button>
        </div>
      </div>
    </>
  );
}
