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

  const [isFocused, setIsFocused] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [base64Image, setBase64Image] = useState(null);
  const [invoice, setInvoice] = useState("");
  const [rows, setRows] = useState([]);
  const [tax, setTax] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0)
  const [dueBalance, setDueBalance] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deposit, setDeposite] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [notes, setNotes] = useState("");

  const handleInputChange = (e) => {
    setFrom(e.target.value);
  };

  const calculateTotalPrice = (updatedRows, taxRate = taxPercentage, deposite = deposit) => {

    let newSubtotal = updatedRows.reduce((sum, row) => sum + row.price, 0);
    setSubtotal(newSubtotal);

    let newTaxAmount = (taxRate / 100) * newSubtotal;
    setTaxAmount(newTaxAmount);

    let newTotal = newSubtotal + newTaxAmount;
    setTotalPrice(newTotal);

    let newDueBalance = newTotal - deposite;
    setDueBalance(newDueBalance);
  };

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
        setFrom(result.from);
        setTo(result.to);
        setInvoice(result.invoice);
        setBase64Image(result.logoImage)
        setTotalPrice(result.total);
        setRows(result.rows);
        setSubtotal(result.subtotal);
        setTaxAmount(result.taxAmount); 
        setDueBalance(result.dueBalance);
        setDeposite(result.advanceDeposite);
        setTaxPercentage(result.taxParcentage);
        setNotes(result.notes);
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
    setTotalPrice(totalPrice + updatedPrice);
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
      price: updatedPrice,
    };

    setRows(updatedRows);
    calculateTotalPrice(updatedRows);
  };

  const handleTaxAndDepositChange = (event) => {
    const { name, value } = event.target;
    if (name === "tax") {
      const taxValue = parseFloat(value) || 0;
      setTaxPercentage(taxValue);
      calculateTotalPrice(rows, taxValue);
    } else if (name === "deposite") {
      const depositValue = parseFloat(value) || 0;
      setDeposite(depositValue);
      calculateTotalPrice(rows, taxPercentage, depositValue);
    }
  };

  const handleUpdateInvoice = async () => {
    try {
      let data = await fetch(
        `http://localhost:3000/api/save-invoice/${editID}`,
        {
          method: "PUT",
          body: JSON.stringify({ 
            from: from,
            to: to, 
            invoice, 
            rows,
            totalPrice, 
            subtotal: subtotal,
            taxAmount: taxAmount,
            deposite : deposit,
            taxPercentage: taxPercentage, 
            dueBalance: dueBalance,
            notes
           }),
        }
      );

      data = await data.json();
      console.log("data--->", data)
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

  const handleNotes = (e)=>{
    setNotes(event.target.value)
  }

  return (
    <>
      <div className={styles.invoiceContainer}>
        <header className={styles.invoiceHeader}>
          <div className={styles.companyDetails}>
          <textarea
     
     className={`${styles.textarea} ${isFocused ? styles.focused : ''}`}
     rows="7"
     maxLength="500" 
     placeholder="Type here..."
     value={from}
     onChange= {handleInputChange}
     onFocus={() => setIsFocused(true)}
     onBlur={() => setIsFocused(false)}
     spellCheck="false" 
   />
          </div>
          <div>
          <div className={styles.companyLogo}>
            <Image
              src={require("../../public/images.png")}
              alt="GFG logo imported from public directory"
              height="100"
              width="600"
            />
            </div>
          {base64Image && (
        <div>
          <Image src={base64Image} alt="Logo Image" height="100" width="200" />
        </div>
        
      )}
          
          </div>
        </header>

        <section className={styles.invoiceDetails}>
          <h1>INVOICE</h1>
          <div className={styles.invoiceInfo}>
            <strong>Invoice #:</strong>{" "}
            <textarea style={{ height: "40px" ,resize: "none"}} name="invoice" value={invoice}>
              {" "}
            </textarea>
            <p>
              <strong>Date:</strong>{" "}
              <input type="text" value={` ${day}-${month}-${year}`} />
            </p>
            <p>
              <strong>Amount Due:</strong>
              {`$${totalPrice}`}
            </p>
          </div>
        </section>

        <section className={styles.clientDetails}>
          <p>
            <strong>To:</strong>
          </p>
          <textarea
            type=" text"
            name="to"
            style={{ height: "100px", overflow: "hidden", resize: "none", spellCheck: "false"}}
            value={to}
          >
            {" "}
          </textarea>
        </section>

        <section className={styles.currencySelection}>
          <label htmlFor="currency">Dollar($):</label>
          <select id="currency" name="currency">
            <option value="Dollar">Dollar ($)</option>
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
                <td>${row.price ? row.price.toFixed(2) : "0.00"}</td>
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
                <td>{`$${subtotal}`}</td>
              </tr>
              <tr>
                <td>Tax (%)</td>
                <td>
                  <input
                    type="number"
                    name="tax"
                    placeholder="Enter Tax"
                    onChange={handleTaxAndDepositChange}
                    value={taxPercentage}
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
                    value={deposit}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{`$${totalPrice}`}</strong>
                </td>
              </tr>
              <tr>
                <td>Amount Paid</td>
                <td>{`$${deposit}`}</td>
              </tr>
              <tr className={styles.balanceRow}>
                <td>
                  <strong>Balance Due</strong>
                </td>
                <td>
                  <strong>{`$${dueBalance.toFixed(2)}`}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.info}>
          <strong>Notes </strong><textarea  className = {styles.noteInput} value= {notes} onChange = {handleNotes} spellCheck="false" />
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
