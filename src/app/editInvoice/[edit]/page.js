"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../../invoice.module.css";
import { useRouter } from "next/navigation";

const EditInvoie = (props) => {
  const router = useRouter();
  const editID = props.params.edit;

  //Date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const [to, setTo] = useState("");
  const [invoice, setInvoice] = useState("");
  const [total, setTotal] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const editInvoice = async () => {
      let result = await fetch(
        `http://localhost:3000/api/save-invoice/${editID}`
      );
      console.log(result);
      if (!result.ok) {
        throw new Error("Network response was not ok");
      } else {
        result = await result.json();
        result = result.data;
        console.log("result2--->", result);
        setTo(result.to);
        setInvoice(result.invoice);
        setTotal(result.total);
        setRows(result.rows);
      }
    };
    editInvoice();
  }, [editID]);
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
    setTotal(total + updatedPrice);
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
      price: updatedPrice,
    };

    setRows(updatedRows);
  };

  const handleUpdateInvoice = async () => {
    try {
      let data = await fetch(
        `http://localhost:3000/api/save-invoice/${editID}`,
        {
          method: "PUT",
          body: JSON.stringify({ to: to, invoice, rows, total }),
        }
      );

      data = await data.json();
      if (data.status) {
        alert("Invoice Updated Successfully");
        router.push('../../listing')
      } else {
        alert("Failed! Please Try again");
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
              src={require("../../public/images.png")}
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
            <textarea style={{ height: "40px" }} name="invoice" value={invoice}>
              {" "}
            </textarea>
            <p>
              <strong>Date:</strong>{" "}
              <input type="text" value={` ${day}-${month}-${year}`} />
            </p>
            <p>
              <strong>Amount Due:</strong>
              {`₹${total}`}
            </p>
          </div>
        </section>

        <section className={styles.clientDetails}>
          <p>
            <strong>To:</strong>
          </p>
          <textarea
            name="to"
            style={{ height: "100px", overflow: "hidden" }}
            type=" text"
            value={to}
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
                    type="text"
                    name="unitCost"
                    placeholder="Enter Unit Cost"
                    value={row.unitCost}
                    onChange={(e) => handleCostAndQua(index, e)}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    type="text"
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
                <td>{`₹${total}`}</td>
              </tr>
              <tr>
                <td>Tax(%) Included</td>
                <td>₹0.00</td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{`₹${total}`}</strong>
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
                  <strong>{`₹${total}`}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.addRow}>
          <button onClick={handleUpdateInvoice}> Update Invoice</button>
        </div>
        <div className={styles.addRow}>
          <button
            className={styles.listingButton}
            onClick={() => router.push("../../")}
          >
            {" "}
            Create New Invoice{" "}
          </button>

          <button
            className={styles.listingButtonControl}
            onClick={() => router.push("../../listing")}
          >
            {" "}
            Back to Listing{" "}
          </button>
        </div>
        <div className={styles.addRow}></div>
      </div>
    </>
  );
};
export default EditInvoie;
