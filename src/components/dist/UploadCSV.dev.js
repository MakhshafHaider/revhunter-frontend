// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/jsx-no-undef */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import io from "socket.io-client";
// import { BASEURL } from "../config";
// import Typography from "@mui/material/Typography";
// import { styled } from "@mui/material/styles";
// import MuiTab from "@mui/material/Tab";
// import InputLabel from "@mui/material/InputLabel";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import Button from "@mui/material/Button";
// import { Input } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import LinearProgressWithLabel from "./LinearProgressWithLabel";
// import SelectInput from "./SelectInput";
// const UploadCSV = ({ clients }) => {
//   const [selectedClient, setSelectedClient] = useState("");
//   const [campaign, setCampaign] = useState([]);
//   const [campaigns, setCampaigns] = useState([]);
//   const [search, setSearch] = useState(null);
//   const [showEmailFieldError, setShowEmailFieldError] = useState(false);
//   const [selectedFile, setSelectedFile] = useState("");
//   const [percentage, setPercentage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [progressCount, setProgressCount] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
//   const socket = io(`${BASEURL}`);
//  console.log("percentage", progressCount);
//  console.log("totalCount", totalCount);
//   const addCampaign = (newCampaignName) => {
//     setCampaigns([...campaigns, { name: newCampaignName }]);
//   };
//   const fileInputRef = useRef();
//    useEffect(() => {
//      socket.on("on-update-progress", (newCount) => {
//       //  console.log("progress count in socket", newCount);
//        setProgressCount(newCount);
//        console.log(`Got on-update-progress event ${totalCount}`);
//      });
//      socket.on("on-total", (newCount) => {
//        console.log("total count before", totalCount);
//        setTotalCount(newCount.total);
//        console.log("total count after value", totalCount);
//        console.log(`Got on-total event ${totalCount}`);
//      });
//    }, [progressCount, totalCount]);
//    useEffect(() => {
//      if (progressCount && totalCount) {
//        console.log("progressCount.progress", progressCount.progress);
//        console.log("totalCount", totalCount);
//        var percentageProgress = (progressCount?.progress / totalCount) * 100;
//        setPercentage(percentageProgress);
//      }
//    }, [progressCount, totalCount]);
//   const handleClientChange = () => {
//     getCampaigns();
//   };
//   useEffect(() => {
//     const selectedClientData = clients.find(
//       (client) => client.name === selectedClient
//     );
//     console.log("selectedClientData in ue", selectedClientData?.campaigns);
//     setCampaigns(selectedClientData?.campaigns);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedClient]);
//   const handleFileChange = async (e) => {
//     // fileInputRef.current.value = "";
//     if (selectedFile) {
//       setShowEmailFieldError(false);
//       setLoading(true); // Show the linear progress bar
//       const formData = new FormData();
//       formData.append("file", selectedFile);
//       formData.append("client", selectedClient.name || selectedClient);
//       formData.append("campaign", campaign);
//       console.log("formData", formData);
//       try {
//         const res = await axios.post(`${BASEURL}upload`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         setSelectedClient("");
//         setCampaign("");
//         setSelectedFile("");
//         console.log("res", res);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false); // Hide the linear progress bar
//       }
//     }
//   };
//     const handleFileUpload = async(e) => {
//       const file = e.target.files[0];
//       console.log("file", file);
//       if (file && file.name.endsWith(".csv")) {
//         setSelectedFile(file);
//       } else {
//         alert("Please select a CSV file.");
//         setSelectedFile(null);
//       }
//         }
//  const updateCampaigns = (newSearch) => {
//     setSearch(newSearch);
//     handleCampaignChange();
//     console.log("campaignName:", campaign);
//     console.log(search);
//   };
//   const getCampaigns = () => {
//     if (selectedClient) {
//       axios
//         .get(`${BASEURL}clients/${selectedClient.name}/campaigns`)
//         .then((res) => {
//           setCampaigns(res.data.campaigns);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   };
//   const handleSelectedClient = (e) =>{
//    setSelectedClient(e.target.value);
//   //  const filteredCampaigns
//   }
//  const handleCampaignChange =(e) => {
//    setCampaign(e.target.value);
// }
//  const handleOptionSelected = (selectedOption) => {
//    // Do something with the selected option, e.g., save it to state
//    console.log("Selected option:", selectedOption);
//  };
//  const options = [
//    { value: "option1", label: "Option 1" },
//    { value: "option2", label: "Option 2" },
//    { value: "option3", label: "Option 3" },
//  ];
//   return (
//     <div>
//       <Typography
//         variant="h6"
//         style={{ marginTop: "20px", marginLeft: "20px" }}
//       >
//         {" "}
//         Upload CSV
//       </Typography>
//       <div style={{ margin: "0 20px" }}>
//         <Grid container spacing={2}>
//           <Grid item xs={4}>
//             <FormControl fullWidth variant="outlined" margin="dense">
//               <InputLabel id="receiver-position-label">
//                 Select Client
//               </InputLabel>
//               <Select
//                 labelId="receiver-position-label"
//                 id="receiver-position"
//                 label="Receiver Position"
//                 value={selectedClient}
//                 onChange={handleSelectedClient}
//               >
//                 {clients.map((client) => (
//                   <MenuItem key={client._id} value={client.name}>
//                     {client.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <SelectInput
//             options={options}
//             onSelectChange={handleOptionSelected}
//           />
//           <Grid item xs={4}>
//             <FormControl fullWidth variant="outlined" margin="dense">
//               <InputLabel id="receiver-position-label">
//                 Select Campaigns
//               </InputLabel>
//               <Select
//                 labelId="receiver-position-label"
//                 id="receiver-position"
//                 label="Receiver Position"
//                 onChange={handleCampaignChange}
//                 value={campaign}
//               >
//                 {campaigns &&
//                   campaigns.map((campaign) => (
//                     <MenuItem value={campaign.name}> {campaign.name}</MenuItem>
//                   ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <div style={{ margin: "30px 10px" }}>
//             <label htmlFor="file-input">
//               <Button
//                 component="span"
//                 variant="contained"
//                 style={{ width: "150px", height: "40px" }}
//               >
//                 {selectedFile ? selectedFile.name : "Select file"}
//               </Button>
//             </label>
//             <Input
//               id="file-input"
//               type="file"
//               accept=".csv"
//               ref={fileInputRef}
//               style={{ display: "none" }}
//               onChange={handleFileUpload}
//             />
//           </div>
//           <div style={{ margin: "30px 10px" }}>
//             <Button variant="contained" onClick={handleFileChange}>
//               Upload File
//             </Button>
//             {totalCount > 0 && (
//               <p>
//                 {progressCount && progressCount.progress} / {totalCount}{" "}
//                 uploaded
//               </p>
//             )}
//           </div>
//         </Grid>
//         {loading && <LinearProgressWithLabel value={percentage} />}
//       </div>
//       {/* <div className="row">
//         <div className="col">
//           <select
//             value={selectedClient}
//             onChange={(e) => setSelectedClient(e.target.value)}
//           >
//             <option value={null}>Select Client</option>
//             {clients.map((client) => (
//               <option key={client.id} value={client}>
//                 {client.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="col">
//           <select
//             value={campaign}
//             onChange={(e) => setCampaign(e.target.value)}
//           >
//             <option value={null}>Select Campaign</option>
//             {filteredCampaigns.map((c) => (
//               <option key={c.id} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="col">
//           <input
//             type="file"
//             accept=".csv"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//           />
//         </div>
//         <div className="col">
//           <button onClick={handleFileChange}>Upload</button>
//         </div>
//       </div> */}
//       {showEmailFieldError && (
//         <p className="error-message">
//           CSV file must contain an "email", "first_name" and "company_name"
//           field
//         </p>
//       )}
//     </div>
//   );
// };
// export default UploadCSV;
"use strict";