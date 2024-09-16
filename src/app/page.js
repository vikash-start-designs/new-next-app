"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./invoice.module.css";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter()
  const [rows, setRows] = useState([
    {
      item: "Web Updates",
      description: "Monthly web updates for http://widgetcorp.com",
      unitCost: 650.5,
      quantity: 1,
      price: 650.0,
    },
  ]);
  //Date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
  const year = currentDate.getFullYear();

  const [totalPrice, setTotalPrice] = useState(650.0);
  const [to, setTo] = useState("");
  const [invoice, setInvoice] = useState("SD/19-20/09-S001");
  const [tax, setTax] = useState("")
  const [subtotal, setSubtotal] = useState("")


const calculateTotalPrice = (updatedRows) => {
  let newTotal = updatedRows.reduce((sum, row) => sum + row.price, 0);
  setSubtotal(newTotal);
  let taxValue = newTotal*10/100;
  newTotal = newTotal + taxValue;
 
  setTotalPrice(newTotal);
  setTax(taxValue);
};
  const handleTO = (toValue) => {
    console.log("tovalue", toValue);
    setTo(toValue);
  };

  const handleInvoice = (invoiceValue) => {
    console.log("invoiceValue", invoiceValue);
    setInvoice(invoiceValue);
  };
  const handleAddNewRow = () => {
    setRows([
      ...rows,
      { item: "", description: "", unitCost: "", quantity: "", price: 0 },
    ]);
  };


  
  const handleCostAndQua = (index, event) => {
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

    // Calculate the new price
    const updatedPrice = updatedUnitCost * updatedQuantity;
    setTotalPrice(totalPrice + updatedPrice);
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
      price: updatedPrice,
    };

    setRows(updatedRows);
    calculateTotalPrice(updatedRows);
  };

  const saveInvoice = async () => {
    try {
      let data = await fetch("http://localhost:3000/api/save-invoice", {
        method: "POST",
        body: JSON.stringify({
          to: to,
          invoice,
          rows,
          total: totalPrice,
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
              {`₹${totalPrice}`}
            </p>
          </div>
        </section>

        <section className={styles.clientDetails}>
          <p>
            <strong>To:</strong>
          </p>
          <textarea
            name="to"
            style={{ height: "100px", overflow: "hidden"}}
            type=" text"
            onChange={(event) => handleTO(event.target.value)}
          >
            {" "}
          </textarea>
        </section>

        <section className={styles.currencySelection}>
          <label htmlFor="currency">Rupees(₹):</label>
          <select id="currency" name="currency">
            <option value="INR">Rupees (₹)</option>
          </select>
        </section>

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
                    onChange={(e) => handleCostAndQua(index, e)}
                    name="item"
                     
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter Description"
                    value={row.description}
                    onChange={(e) => handleCostAndQua(index, e)}
                    name="description"
                  />{" "}
                </td>
                <td>
                  <input
                    type="number"
                    name="unitCost"
                    placeholder="Enter Unit Cost"
                    value={row.unitCost}
                    onChange={(e) => handleCostAndQua(index, e)}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    input type="text" inputmode="numeric"
                    name="quantity"
                    placeholder="Quantity"
                    value={row.quantity}
                    onChange={(e) => handleCostAndQua(index, e)}
                  />
                </td>
                <td>₹{row.price ? row.price.toFixed(2) : "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.invoiceTotal}>
          <div className={styles.addRow}>
            <button onClick={handleAddNewRow}>Add New Row</button>
          </div>
          <table className={styles.summaryTable}>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>{`₹${subtotal}`}</td>
              </tr>
              <tr>
                <td>Tax(10%) Included</td>
                <td>{`+ ₹${tax}`}</td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{`₹${totalPrice}`}</strong>
                </td>
              </tr>
              <tr>
                <td>Amount Paid</td>
                <td>₹0.00</td>
              </tr>
              <tr className={styles.balanceRow}>
                <td>
                  <strong>Balance Due</strong>
                </td>
                <td>
                  <strong>{`₹${totalPrice}`}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.addRow}>
          <button onClick={saveInvoice}> Save Invoice</button>
        </div>
        <div className={styles.addRow}>
        <button className={styles.listingButton} onClick={()=>router.push('/listing')}> Listing </button>
        </div>
      
      </div>
    </>
  );
}


