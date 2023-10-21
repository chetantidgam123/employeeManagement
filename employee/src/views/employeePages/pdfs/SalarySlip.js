import React, { useRef } from 'react'
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const SalarySlip = () => {
    const pdfRef = useRef()
    const styles= {
        downloadPdfButton:{
            backgroundColor:'blue',
            color:'white'
        },
        parentDiv:{
            padding:'10px 50px',
            fontSize:'20px'
        }
    }
    const downloadPdfDocument = () => {
        const input = pdfRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                var pdf = new jsPDF('p','mm',0,true);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth/imgWidth,pdfHeight/imgHeight);
                const imgX = (pdfWidth-imgWidth * ratio)/2;
                const imgY = 20;
                pdf.addImage(imgData,'PNG',imgX,imgY,imgWidth*ratio,imgHeight*ratio);
                pdf.save(`salarySlip.pdf`); 
            })
    }
  return (
    <div>
        <img src="assets/img/successful.png" alt=""/>
    <div style={styles.parentDiv}  ref={pdfRef}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam consequatur, impedit rem, sit quaerat est consectetur cumque nesciunt hic dolores, doloribus dolor dignissimos expedita debitis distinctio error mollitia voluptas quidem.</div>
    <button style={styles.downloadPdfButton} onClick={downloadPdfDocument}>download Pdf</button>
    </div>
  )
}

export default SalarySlip