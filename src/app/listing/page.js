"use client";
import { BsArchiveFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import styles from "../listingData.module.css";
import { useRouter } from "next/navigation";

const Listing = () => {
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const invoiceDetails = async () => {
      try {
        let invoiceData = await fetch("http://localhost:3000/api/save-invoice");
        if (!invoiceData.ok) {
          throw new Error("Network response was not ok");
        }

        invoiceData = await invoiceData.json();
        console.log("invoice", invoiceData);

        let response = invoiceData.data;
        console.log("res--->", response);
        setInvoice(response);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    invoiceDetails();
  }, []);

  useEffect(() => {
    if (invoice) {
      console.log("Updated invoice state:", invoice);
    }
  }, [invoice]);



  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeader}>Customer</th>
            <th className={styles.tableHeader}>Invoice NO</th>
            <th className={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoice && invoice.length > 0 ? (
            invoice.map((inv, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{inv.to}</td>
                <td className={styles.tableCell}>{inv.invoice}</td>

                <button
                  onClick={() => {
                    router.push(`/editInvoice/${inv._id}`);
                  }}
                  className={styles.invoiceButton}
                >
                  Show
                </button>
                <a><BsArchiveFill onClick={()=>{router.push(`../delete/${inv._id}`)}}/></a>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.tableCell}>
                No invoices available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={() => {
          router.push(`../`);
        }}
        className={styles.newinvoiceButton}
      >
        Add New Invoice
      </button>
    </div>
  );
};
export default Listing;
