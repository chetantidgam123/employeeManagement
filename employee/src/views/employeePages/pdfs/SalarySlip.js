import React, { useRef, useState } from 'react'
import html2canvas from "html2canvas";
import moment from 'moment'
import { jsPDF } from "jspdf";
import DatePicker from 'react-datepicker'
import { postCall } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'
import "./pdf.css"
const SalarySlip = () => {
    const [startDate, setStartDate] = useState(moment(new Date()).subtract(1,'month')._d)
    const [jsonData,setJsonData] = useState({
        month:"",
        year:""
    })
    const [checkBox,setChekBox] = useState({
        pf:false,
        esic:false
    })
    const [loader,setLoader] =useState(false)
    const [previewSlip,setPreviewSlip] =useState(false)
    const [salarySlipData,setSalarySlipData] =useState({})
    const pdfRef = useRef()
    const downloadPdfDocument = () => {
        setLoader(true)
        const input = pdfRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                var pdf = new jsPDF('p', 'mm', 'a4', true);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 20;
                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                setLoader(false)
                pdf.save(`salarySlip.pdf`);
            })
    }
    const getMonthYear = async (date)=>{
        setStartDate(date)
        setJsonData({...jsonData,month:moment(date).month()+1,year:moment(date).year()});
        console.log(checkBox);
        }
        const handleChangeInput = (e)=>{
            const {name,value} = e.target;
                setChekBox({...checkBox,[name]:e.target.checked})

        }
        const previewSalSlip = async ()=>{
              await postCall('/users/getSalarySlip', jsonData)
                .then((result) => {
                  if (result.data.status) {
                    setSalarySlipData(result.data.data)
                    setPreviewSlip(true)
                    success_toast(result.data.message)
                  } else {
                    error_toast(result.data.message)
                  }
                })
                .catch((err) => {
                  error_toast(err.response.data.message)
                })
        }
    return (
        <div>
             <DatePicker
          className="form-control"
          selected={startDate}
          onChange={(date) => getMonthYear(date)}
          showMonthYearPicker
          excludeDates={[1661990400000, 1664582400000, 1667260800000, 1672531200000]}
          dateFormat="MM/yyyy"
          maxDate={moment(new Date()).subtract(1,'month')._d}
        />
        <label className='ms-4'>PF: <input className='mx-2' type="checkbox" name="pf" id="" checked={checkBox.pf} onChange={(e)=>{handleChangeInput(e)}} /></label>
        <label>ESIC: <input className='mx-2' type="checkbox" name="esic" id="" onChange={(e)=>{handleChangeInput(e)}} checked={checkBox.esic} /></label>
        <button className='btn btn-primary' onClick={previewSalSlip}>Preview Salary Slip</button>
           {previewSlip && <>
            <div id='parentDiv' ref={pdfRef}>
                <div>
                <p style={{ marginBottom: '20pt' }}><span>
                    <table border="0" style={{ margin: 'auto' }}>
                        <tr>
                            <td>
                                <img width="250" height="150" src="assets/img/company_logo.jpeg" />
                            </td>
                        </tr>
                    </table>
                </span></p>
                <table style={{ borderCollapse: 'collapse', width:'92%', margin: 'auto' }} cellSpacing={0}>
                    <tbody><tr style={{ height: '14pt' }}>
                        <td style={{ width: '502pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#C4D59B" }} colSpan={8}>
                            <p className="s1" style={{ paddingLeft: '148pt', paddingRight: '147pt', textIndent: '0pt', textAlign: 'center' }}>
                                Prevoyance IT Solutions Pvt. Ltd. - Payslip</p>
                        </td>
                    </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '502pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#FFFFCC" }} colSpan={8}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '14pt' }}>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Name:</p>
                            </td>
                            <td style={{ width: '131pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '12pt', textAlign: 'left' }}>{(salarySlipData?.firstname).toUpperCase()+' '+(salarySlipData?.lastname).toUpperCase()}</p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '127pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>PAN</p>
                            </td>
                            <td style={{ width: '128pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={3}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{salarySlipData?.pan_number}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ height: '14pt' }}>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Designation:
                                </p>
                            </td>
                            <td style={{ width: '131pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{(salarySlipData?.designation).toUpperCase()}</p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '127pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>UAN</p>
                            </td>
                            <td style={{ width: '128pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={3}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>101335798869
                                </p>
                            </td>
                        </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Dept:</p>
                            </td>
                            <td style={{ width: '131pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>IT</p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '127pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Bank Name
                                </p>
                            </td>
                            <td style={{ width: '128pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={3}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{(salarySlipData.bank_name).toUpperCase()}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Emp.ID</p>
                            </td>
                            <td style={{ width: '131pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{salarySlipData.emp_id}</p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '127pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Account No
                                </p>
                            </td>
                            <td style={{ width: '128pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={3}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{salarySlipData.bank_acc_number}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Location</p>
                            </td>
                            <td style={{ width: '131pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Nagpur</p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '127pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Month
                                    payable</p>
                            </td>
                            <td style={{ width: '128pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={3}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{moment(jsonData.year+'-'+jsonData.month+'-01').format('MMMM')}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>DOJ:</p>
                            </td>
                            <td style={{ width: '131pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '11pt', textAlign: 'left' }}>{salarySlipData?.doj}
                                </p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '127pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Days Of
                                    Month</p>
                            </td>
                            <td style={{ width: '128pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={3}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{moment(jsonData.year+'-'+jsonData.month+'-01').daysInMonth()}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '502pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#F0DCDB" }} colSpan={8}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '15pt' }}>
                            <td style={{ width: '247pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2}>
                                <p className="s5" style={{ paddingLeft: '96pt', paddingRight: '95pt', textIndent: '0pt', textAlign: 'center' }}>
                                    COMPONENTS</p>
                            </td>
                            <td style={{ width: '255pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={6}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '16pt' }}>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FFFF99' }}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>A: Monthly</p>
                            </td>
                            <td style={{ width: '189pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FFFF99' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '127pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FFFF99' }} colSpan={3}>
                                <p className="s5" style={{ paddingLeft: '57pt', paddingRight: '55pt', textIndent: '0pt', textAlign: 'center' }}>PM</p>
                            </td>
                            <td style={{ width: '128pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FFFF99' }} colSpan={3}>
                                <p className="s5" style={{ paddingLeft: '58pt', paddingRight: '56pt', textIndent: '0pt', textAlign: 'center' }}>PA</p>
                            </td>
                        </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '189pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s6" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>1.1 <span className="s2">Basic</span></p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '25pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '41pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s7" style={{ textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.5}</p>
                            </td>
                            <td style={{ width: '37pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '45pt', borderTopStyle: 'solid', borderTopWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '46pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ textIndent: '0pt', lineHeight: '9pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.5*12}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '14pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s6" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>1.2 <span className="s2">HRA</span></p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '25pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '41pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.25}</p>
                            </td>
                            <td style={{ width: '37pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '45pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '46pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.25*12}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '15pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s6" style={{ paddingTop: '1pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>1.3 <span className="s2">DA</span></p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '25pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '41pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.20}</p>
                            </td>
                            <td style={{ width: '37pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '45pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '46pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.20*12}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '22pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s6" style={{ paddingTop: '3pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>1.4 <span className="s2">Medical &amp; Convenience</span></p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '25pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '3pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '41pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '3pt', textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.05}</p>
                            </td>
                            <td style={{ width: '37pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '3pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '45pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '46pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '3pt', textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal)*0.05*12}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '10pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s5" style={{ paddingRight: '24pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'right' }}>Total (A)</p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '66pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#FAE9D9" }}>
                                <p className="s5" style={{ paddingLeft: '41pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{salarySlipData.increse_sal}</p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '67pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#F0DCDB" }}>
                                <p className="s2" style={{ paddingLeft: '34pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>{salarySlipData.increse_sal*12}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ height: '8pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '58pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s5" style={{ paddingLeft: '24pt', paddingRight: '21pt', textIndent: '0pt', lineHeight: '7pt', textAlign: 'center' }}>
                                    </p>
                            </td>
                            <td style={{ width: '61pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '66pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#FAE9D9" }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '61pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '67pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#F0DCDB" }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '17pt' }}>
                            <td style={{ width: '247pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FFFF99' }} colSpan={2}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>B: Benefits</p>
                            </td>
                            <td style={{ width: '25pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', backgroundColor: "#FFFF99" }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', backgroundColor: "#FFFF99" }}>
                                <p className="s5" style={{ paddingLeft: '33pt', textIndent: '0pt', textAlign: 'left' }}>PM</p>
                            </td>
                            <td style={{ width: '41pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', backgroundColor: "#FFFF99" }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '37pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', backgroundColor: "#FFFF99" }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '45pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', backgroundColor: "#FFFF99" }}>
                                <p className="s5" style={{ paddingLeft: '22pt', textIndent: '0pt', textAlign: 'left' }}>PA</p>
                            </td>
                            <td style={{ width: '46pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FFFF99' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '12pt' }}>
                            <td style={{ width: '189pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s6" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>2.1 <span className="s2">Provident Fund</span></p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '25pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '41pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ textIndent: '0pt', lineHeight: '9pt', textAlign: 'right' }}>{checkBox.pf?(salarySlipData.increse_sal*0.12):''}</p>
                            </td>
                            <td style={{ width: '37pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '45pt', borderTopStyle: 'solid', borderTopWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '46pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'right' }}>{checkBox.pf?(salarySlipData.increse_sal*0.12*12):''}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '14pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s6" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>2.3 <span className="s2">ESIC</span></p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '25pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '41pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'right' ,fontWeight:'normal' }}>{checkBox.esic?(salarySlipData.increse_sal*0.04):''}</p>
                            </td>
                            <td style={{ width: '37pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '45pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '46pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'right' }}>{checkBox.esic?(salarySlipData.increse_sal*0.04*12):''}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '16pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s6" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>2.4 <span className="s2">Bonus</span></p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '25pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '41pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '37pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '45pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '46pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s6" style={{ paddingTop: '2pt', textIndent: '0pt', textAlign: 'right' }}>-</p>
                            </td>
                        </tr>
                        <tr style={{ height: '9pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s8" style={{ paddingTop: '5pt', paddingLeft: '59pt', textIndent: '0pt', lineHeight: '3pt', textAlign: 'left' }}>\
                                </p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s5" style={{ paddingRight: '24pt', textIndent: '0pt', lineHeight: '8pt', textAlign: 'right' }}>Total (B) </p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '8pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '66pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} rowSpan={2}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '8pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '67pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} rowSpan={2}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '8pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }} rowSpan={2}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '58pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} rowSpan={2}>
                                <p className="s5" style={{ paddingLeft: '9pt', textIndent: '15pt', lineHeight: '9pt', textAlign: 'left' }}>
                                </p>
                            </td>
                            <td style={{ width: '61pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '61pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: '#FAE9D9' }} colSpan={2}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '10pt' }}>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={2} rowSpan={2}>
                                <p className="s5" style={{ paddingTop: '6pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '66pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#FAE9D9" }} rowSpan={2}>
                                <p className="s5" style={{ paddingTop: '6pt', paddingLeft: '41pt', textIndent: '0pt', textAlign: 'left' }}>{(salarySlipData.increse_sal-(checkBox.pf?salarySlipData.increse_sal*0.04:0)-( checkBox.esic?salarySlipData.increse_sal*0.12:0))}</p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#FAE9D9" }} colSpan={2} rowSpan={2}>
                                <p className="s5" style={{ paddingTop: '6pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '67pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#F0DCDB" }}>
                                <p className="s2" style={{ paddingLeft: '34pt', textIndent: '0pt', lineHeight: '8pt', textAlign: 'left' }}>{(salarySlipData.increse_sal-(checkBox.pf?salarySlipData.increse_sal*0.04:0)-( checkBox.esic?salarySlipData.increse_sal*0.12:0))*12}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ height: '13pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '58pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s5" style={{ paddingRight: '9pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'right' }}>TOTAL CTC: [A+B]
                                </p>
                            </td>
                            <td style={{ width: '67pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#F0DCDB" }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '14pt' }}>
                            <td style={{ width: '502pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#FFFF99" }} colSpan={8}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '28pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                                <p className="s5" style={{ paddingLeft: '54pt', textIndent: '0pt', textAlign: 'left' }}>COMPONENTS</p>
                            </td>
                            <td style={{ width: '119pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={3}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                                <p className="s9" style={{ paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>MONTHLY TAKE HOME</p>
                            </td>
                            <td style={{ width: '194pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={4}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                                <p className="s5" style={{ paddingLeft: '62pt', textIndent: '0pt', textAlign: 'left' }}>LEAVE POLICIES</p>
                            </td>
                        </tr>
                        <tr style={{ height: '17pt' }}>
                            <td style={{ width: '189pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>Gross(Refer
                                    to Total [A] above)</p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '25pt', borderTopStyle: 'solid', borderTopWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '36pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ textIndent: '0pt', lineHeight: '9pt', textAlign: 'right' }}>{salarySlipData.increse_sal}</p>
                            </td>
                            <td style={{ width: '194pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }} colSpan={4} rowSpan={5}>
                                <p className="s2" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '111%', textAlign: 'left' }}>18 Casual
                                    and Sick leaves combined will be awarded in a year</p>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                                <p className="s5" style={{ paddingTop: '6pt', paddingLeft: '39pt', textIndent: '0pt', textAlign: 'left' }}>(1.5 Leaves
                                    per Month)</p>
                            </td>
                        </tr>
                        <tr style={{ height: '16pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>Less: Working Days
                                </p>
                            </td>
                            <td style={{ width: '58pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '25pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '36pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '16pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '3pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>Less : PF
                                    Contribution</p>
                            </td>
                            <td style={{ width: '58pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '3pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '25pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '36pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'right',fontWeight:'normal' }}>{checkBox.pf?(salarySlipData.increse_sal*0.12):''}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '20pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '6pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>Less : ESIC
                                </p>
                            </td>
                            <td style={{ width: '58pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '6pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '25pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}></p>
                            </td>
                            <td style={{ width: '36pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'right',fontWeight:'normal' }}>{checkBox.esic?(salarySlipData.increse_sal*0.04):''}</p>
                            </td>
                        </tr>
                        <tr style={{ height: '16pt' }}>
                            <td style={{ width: '189pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>Less :
                                    Profession Tax</p>
                            </td>
                            <td style={{ width: '58pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '25pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                            <td style={{ width: '36pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s2" style={{ paddingTop: '2pt', textIndent: '0pt', textAlign: 'right' }}>200</p>
                            </td>
                        </tr>
                        <tr style={{ height: '22pt' }}>
                            <td style={{ width: '189pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt' }}>
                                <p className="s5" style={{ paddingLeft: '69pt', textIndent: '0pt', textAlign: 'left' }}>Net Take Home Salary</p>
                            </td>
                            <td style={{ width: '58pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#F0DCDB" }}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>INR</p>
                            </td>
                            <td style={{ width: '61pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#F0DCDB" }} colSpan={2}>
                                <p className="s5" style={{ paddingTop: '6pt', paddingLeft: '35pt', textIndent: '0pt', textAlign: 'right' }}>{(salarySlipData.increse_sal-(checkBox.esic?(salarySlipData.increse_sal*0.04):0)-(checkBox.pf?(salarySlipData.increse_sal*0.12):0)-200)}</p>
                            </td>
                            <td style={{ width: '194pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#FAE9D9" }} colSpan={4}>
                                <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                            </td>
                        </tr>
                        <tr style={{ height: '14pt' }}>
                            <td style={{ width: '502pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderLeftStyle: 'solid', borderLeftWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt', borderRightStyle: 'solid', borderRightWidth: '1pt', backgroundColor: "#C4D59B" }} colSpan={8}>
                                <p className="s5" style={{ paddingLeft: '1pt', textIndent: '0pt', textAlign: 'left' }}>Net Take Home Salary - Twenty
                                    Nine Thousand Eight Hundred Only/-</p>
                            </td>
                        </tr>
                    </tbody></table>
                    <div style={{marginLeft:'39px'}}>
                <p style={{ paddingTop: '1pt', paddingLeft: '7pt', textIndent: '0pt', textAlign: 'left' }}>For Prevoyance IT Solutions Pvt.
                    Ltd</p>
                <h1 style={{ paddingTop: '4pt', paddingBottom: '3pt', paddingLeft: '7pt', textIndent: '0pt', textAlign: 'left' }}>Ankita Soni
                </h1>
                <p style={{textIndent: '0pt', textAlign: 'left' }}><span>
                </span></p><table style={{marginLeft:'9px'}} border={0} cellSpacing={0} cellPadding={0}>
                    <tbody><tr>
                        <td><img width={48} height={27} src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAbADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9RNV1aHSYBLKSd52IicvIx6Ko7k//AF+grJv9Mv8AXreRbu6fTbeRShtrYKWKnIId2B6gjhcYOfmapb+BLrxXp3mgEW0Ek0QYDHmEqu4ehVSw+kh9a1NU1G302xluLiVY4kGSTzn2A6knsBQultyX5nm/heWfTfh74Q1y11G6nW5h09Lm3uZDMs3nmOMkFssrAvkbSAcYIORj1GMYAHtXj/wx1lH8C+F9K1RYtPSxdYNkkgLSGJykCkdmLJuHX/V+9dvcfEnQLeNGjvxenzHiZLGJ7lkKnadyxhiBuwMngkj1q5RadmJSR0dnfQ3yO8Lh1RzGxwRhgcEc1OWA71wNz8Rb2wuYkvtFfS7aaT9zc3U8ZMqdcLChMpkI/g28dz2qwms+LPEkcgsNLi8P25chbzUsyzMnZlgGME+jsMeh7LlYcyOj1TTJbme3u7YpHeW4ZUaRcqVbG5D3wdqnI7qOvQ8b8QItd1Wyh0caTazyag3lLcqGmS2GcNIxIXaQjORzyRjqa9HqKcARswHzetEXZjcUz55f4N6NpPjvVNQ11bSK1uDC8ZijkhAXnMcQQnczOSNuSwGMAlgV9Ts7LUdWLnSrKPw5YyKqtdSwqbuUAYG2M8JgYwZMkcjYKxvhJdSeKNQ8SalqpF7e2mq3FlbyyKP3MKhcKoHC+5HJ7k16cqgHpWlSbbSZMUYujeENN0SR5oYDJeSD95eXDmWd/q7ZOPYcDsBW2o2jAFOorH1ND//Z" />
                        </td>
                    </tr>
                    </tbody></table>
                <p />
                <p className="s10" style={{ paddingTop: '1pt',paddingLeft:'7pt', textIndent: '0pt', textAlign: 'left' }}>Human Resourse
                    Management</p>
                    </div>
                </div>
            </div>
            <div className='text-center'>
            <button className="btn btn-primary" type="button" onClick={downloadPdfDocument} disabled={loader}>
            {loader && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                Download Pdf
            </button>
            </div> 
           </>
            }
        </div>
    )
}

export default SalarySlip