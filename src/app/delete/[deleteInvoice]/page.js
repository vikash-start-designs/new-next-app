"use client";
import { useRouter } from "next/navigation";

const Delete = (props)=>{
    const router = useRouter();

    const handleDelete = async()=>{
    const deleteListID = props.params.deleteInvoice;
    console.log("deleteListID", deleteListID);
   
    try {
      let invoiceDeteledData = await fetch(`http://localhost:3000/api/save-invoice/${deleteListID}`, {
        method : "DELETE"
      })
      console.log("invoiceDeteledData-->", invoiceDeteledData);
      if (!invoiceDeteledData.ok) {
        throw new Error("Network response was not ok");
      }else{
        invoiceDeteledData = await invoiceDeteledData.json();
        router.push('../../listing')
      }
    } catch (error) {
        console.error("Fetch error:", error);
    }
    }
    handleDelete();
    return (
        <>
        </>
    )
}
export default Delete;