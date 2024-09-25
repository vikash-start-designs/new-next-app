
"use client";
import { MdAddCircleOutline } from "react-icons/md";
import Image from "next/image";
import { useState } from "react";
import styles from "./invoice.module.css";
import { useRouter } from "next/navigation";
import html2pdf from "html2pdf.js";

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
  const initialValue = `START DESIGNS 
  House No. 677, 3rd floor Office No. 308 to 311,
  Chandalal Kalyanmal Complex,
  Kishanpol Bazar, Jaipur - 302002
  startdeesigns@gmail.com
  
  GSTIN: 08ACUFS9062L1Z3`;

  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);

  const [imageSrc, setImageSrc] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const [to, setTo] = useState("");
  const [invoice, setInvoice] = useState("SD/19-20/09-S001");
  const [subtotal, setSubtotal] = useState(10.0);
  const [taxPercentage, setTaxPercentage] = useState(0); // Percentage
  const [taxAmount, setTaxAmount] = useState(0); // Calculated tax amount
  const [deposite, setDeposite] = useState(0);
  const [dueBalance, setDueBalance] = useState(10.0);
  const [totalPrice, setTotalPrice] = useState(10.0);
  const [notes, setNotes] = useState("");
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

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

  const handleNotes = (e)=>{
    setNotes(event.target.value)
  }

  const saveInvoice = async () => {
    try {
      console.log("deposite--->", deposite);
      console.log("taxxxxx--->", taxPercentage)
      let data = await fetch("http://localhost:3000/api/save-invoice", {
        method: "POST",
        body: JSON.stringify({
          from : inputValue,
          to: to,
          logo : base64Image,
          invoice,
          rows,
          subtotal: subtotal,
          taxAmount: taxAmount,
          deposite : deposite,
          taxPercentage: taxPercentage, 
          total: totalPrice,
          dueBalance: dueBalance,
          notes
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

  const generatePDF = async() => {
    const logoSrc = await fetch("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkvkv3Zqlxnwu9WusFcKKSmwGhv8zNbJqP1w&s")
    .then((img) => img.blob())
    .then((blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob); // Convert the blob to base64 string
      });
    });
    const element = document.createElement("div");

    element.innerHTML = `
    
      <div style="text-align:center; margin-bottom: 20px;">
      <img src="${logoSrc}" alt="Company Logo" width="150" />
    </div>
      <h1>Invoice</h1>
      <p><strong>From:</strong> ${inputValue}</p>
      <p><strong>To:</strong> ${to}</p>
      <p><strong>Invoice #:</strong> ${invoice}</p>
      <p><strong>Date:</strong> ${day}-${month}-${year}</p>
      <img src="${base64Image}" alt="Upload-logo" width="100" height="50" />
      

      <h2>Items:</h2>
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Unit Cost</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                `<tr>
                  <td>${row.item}</td>
                  <td>${row.description}</td>
                  <td>$${row.unitCost}</td>
                  <td>${row.quantity}</td>
                  <td>$${row.price}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <h2>Summary:</h2>
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <tbody>
          <tr>
            <td><strong>Subtotal</strong></td>
            <td>$${subtotal}</td>
          </tr>
          <tr>
            <td><strong>Tax (%)</strong></td>
            <td>${taxPercentage}%</td>
          </tr>
          <tr>
            <td><strong>Tax Amount</strong></td>
            <td>$${taxAmount}</td>
          </tr>
          <tr>
            <td><strong>Deposited</strong></td>
            <td>$${deposite}</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td>$${totalPrice}</td>
          </tr>
          <tr>
            <td><strong>Due Balance</strong></td>
            <td>$${dueBalance}</td>
          </tr>
        </tbody>
      </table>
      </br>
      <strong> Notes:</strong> <p>${notes} </p>
    `;
    // Use html2pdf.js to generate and download the PDF
    const options = {
      margin: 1,
      filename: "Invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  const handleImageChange = async (e)=>{
    console.log("event--->", e);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); 
        setBase64Image(reader.result);  
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      <div className={styles.invoiceContainer}>
        <header className={styles.invoiceHeader}>
          <div className={styles.companyDetails}>
            <strong className={styles.from}>From:</strong>
        <textarea
         className={`${styles.textarea} ${isFocused ? styles.focused : ''}`}
         rows="7"
         maxLength="500" 
         placeholder="Type here..."
         value={inputValue}
         onChange={handleInputChange}
         onFocus={() => setIsFocused(true)}
         onBlur={() => setIsFocused(false)}
         spellCheck="false" 
       />
        
        </div>
        <div>
        <strong>Upload Logo: </strong>
        <input type="file" accept="image/*" onChange={handleImageChange } />

        {/* Preview the selected image */}
      {imageSrc && (
        <div>
          <Image src={imageSrc} alt="Preview Logo" height="100" width="200" />
        </div>
      )}
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
              {`$${dueBalance.toFixed(2)}`}
            </p>
          </div>
        </section>

        <section className={styles.clientDetails}>
          <p>
            <strong>To:</strong>
          </p>
          <textarea
            name="to"
            style={{ height: "100px", overflow: "hidden",  resize: "none" }}
            onChange={(event) => handleTO(event.target.value)}
            spellCheck="false"
          />
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
        
        <div className={styles.info}>
          <strong>Notes </strong><textarea  className = {styles.noteInput} onChange = {handleNotes} spellCheck="false" />
        </div>


        <div className={styles.addRow}>
          <button onClick={saveInvoice}> Save Invoice</button>
        </div>

        
        <div className={styles.addRow}>
          <button className={styles.listingButton} onClick={() => router.push('/listing')}> Listing </button>
        </div>

        <button className={styles.downloadButton} onClick={generatePDF} >
          Download PDF
        </button>
     
      </div>
    </>
  );
}



