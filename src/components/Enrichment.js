import {
  Box,
  Button,
  Heading,
  Stack,
  Checkbox,
  CheckboxGroup,
  Progress,
  Flex,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { BASEURL } from "../config";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import {
  addEnrichmentDataToDb,
  updateEnrichmentDataToRedux,
  socketURL,
  clearEnrichment,
  removeSelectedCampaigns,
  removeSelectedClients,
} from "../redux/actions/index";
import {
  getClients,
  getCampaignsfromDB,
  ipAddressValue,
  uploadCsv,
  enrichCsv,
} from "./api";
import { buttonColor } from "../shared/globalStyles";
import InputField from "./InputField";
import InputFieldCampaign from "./InputFieldCampaign";

export default function Enrichment() {
  const [clients, setClients] = useState([]);
  const [showEmailFieldError, setShowEmailFieldError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [progressCount, setProgressCount] = useState("");
  const [campaignsClient, setCampaignsClient] = useState([]);
  const [loadingCampaign, setLoadingCampaign] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [showPromptError, setShowPromptError] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [ip, setIP] = useState("");
  const [totalCount, setTotalCount] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const fileInputRef = useRef(null);
  //state
  const getStatsValues = useSelector((state) => state.enrichment.dumy);
  const recordIndex = useSelector((state) => state.recordRedux.records);
  const SOCKETURL = useSelector((state) => state?.socket?.socketURL);
  const selectedClient = useSelector((state) => state.clients.selectedClients);
  const userID = useSelector((state) => state.auth.id);
  const selectedCampaign = useSelector(
    (state) => state.campaign.selectedCampaigns
  );

  const dispatch = useDispatch();

  // store the checkbox in the redux store.
  // const socket = io(`${BASEURL}`);
  useEffect(() => {
    const socket = io(`${BASEURL}`);
    dispatch(socketURL(socket));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //update the checkbox data
  const handleCheckboxChange = (value) => {
    let updatedSelectedCheckboxes = [...selectedCheckboxes];

    if (updatedSelectedCheckboxes.includes(value)) {
      updatedSelectedCheckboxes = updatedSelectedCheckboxes.filter(
        (item) => item !== value
      );
    } else {
      setShowPromptError(false);

      updatedSelectedCheckboxes.push(value);
    }
    setSelectedCheckboxes(updatedSelectedCheckboxes);
    localStorage.setItem("prompt", JSON.stringify(updatedSelectedCheckboxes));
  };

  const getIpData = async () => {
    //call funtion to get ip address
    const res = await ipAddressValue();
    setIP(res.data.ip);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getIpData();
  }, []);

  // get the progress count and total count from BE when csv uploaded
  useEffect(() => {
    if (SOCKETURL) {
      SOCKETURL.on("on-update-progress", (newCount) => {
        setProgressCount(newCount);
      });

      SOCKETURL.on("on-total", (newCount) => {
        setTotalCount(newCount?.total);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressCount, totalCount, getStatsValues, recordIndex]);

  const fetchClients = async () => {
    try {
      // call get clients function
      setLoadingClients(true);
      const res = await getClients();
      setClients(res?.data?.clients);
      setLoadingClients(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    if (SOCKETURL) {
      SOCKETURL.on("error", (err) => {
        console.error(err);
      });
    }

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getCampaigns = async (clientName) => {
      try {
        if (clientName) {
          //call function to get the campaign
          setLoadingCampaign(true);
          const res = await getCampaignsfromDB(clientName);

          setCampaignsClient(res?.data?.campaigns);
          setLoadingCampaign(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCampaign(false);
      }
    };

    getCampaigns(selectedClient);
  }, [selectedClient]);

  // check if the required fields are the in the csv file
  async function getCsvHeaders(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        const headers = csvData.split("\n")[0].split(",");
        resolve(headers);
      };
      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  }

  // get the stats from BE
  useEffect(() => {
    if (SOCKETURL) {
      SOCKETURL.on("on-db-doc-inserted", (statsFromBE) => {
        console.log("on-db-doc-inserted");
        getNewStats(statsFromBE);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStatsValues, recordIndex]);

  // remove the current running enrichment after the promise.allSettle is resolved in BE
  useEffect(() => {
    if (SOCKETURL) {
      SOCKETURL.on("on-db-doc-finished", (index) => {
        console.log("on-db-doc-finished", index);

        dispatch(clearEnrichment(index));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStatsValues, recordIndex]);

  // get stats from to BE and update in the redux store
  const getNewStats = (statsFromBE) => {
    recordIndex.forEach((item, index) => {
      if (item && item.stats && index === statsFromBE.index) {
        if (statsFromBE?.stats?.enrichedNumber >= item?.stats?.enrichedNumber) {
          console.log(" statsFromBE.stats", statsFromBE.stats);
          dispatch(
            updateEnrichmentDataToRedux({
              stats: statsFromBE.stats,
              index: statsFromBE.index,
            })
          );
        }
      } else {
        console.log("No 'stats' property in the item:", item);
      }
    });
  };

  // uppload csv file
  const handleFileUpload = (index) => {
    fileInputRef.current.click();
  };

  // store file name in the state
  const handleFileInputChange = (e, index) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
    } else {
      console.log("Please select a CSV file.");
      setSelectedFile(null);
    }
  };

  // update data in the redux store
  const EnrichmentDataToRedux = async (
    selectedClientData,
    selectedCampaignData,
    prompt
  ) => {
    dispatch(
      addEnrichmentDataToDb([
        {
          client: selectedClientData,
          campaign: selectedCampaignData,
          selectedCheckboxes: selectedCheckboxes,
          prompt: prompt,
          stats: {
            enrichedNumber: 0,
            totalCount: 0,
            totalRecords: 0,
            totalEnrichmentRun: 0,
            faultyUploads: 0,
            EmailNotVerified: 0,
          },
        },
      ])
    );
  };

  // reset client and campaign input field
  const resetClientAndCampaign = async () => {
    dispatch(removeSelectedCampaigns());
    dispatch(removeSelectedClients());
  };

  // handle start button... send file, client and campaign in BE
  const handleFileChange = async () => {
    if (selectedCheckboxes.length === 0 || selectedCheckboxes[0].length === 0) {
      setShowPromptError("Please select at least one Prompt");
    } else {
      if (selectedFile) {
        setShowEmailFieldError(false);

        resetClientAndCampaign();

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("client", selectedClient);
        formData.append("campaign", selectedCampaign);

        // to remove the extra space in the csv field otherwise it through the error while uploading file.
        const csvHeaders = (await getCsvHeaders(selectedFile)).map((header) =>
          header.trim().replace("/r", "")
        );

        // const csvHeaders = await getCsvHeaders(selectedFile);
        // console.log("csvHeaders", csvHeaders);
        if (
          !csvHeaders.includes("website") ||
          !csvHeaders.includes("email") ||
          !csvHeaders.includes("company_name") ||
          !csvHeaders.includes("first_name")
        ) {
          // Show the error message.
          resetClientAndCampaign();
          setSelectedCheckboxes([false, false, false]);
          setShowEmailFieldError(
            "Required fields are email, website, company_name and first_name to upload csv"
          );
          return;
        }
        setShowProgress(true);
        setSelectedCheckboxes([false, false, false]);

        let selectedClientData = localStorage.getItem("clientData");
        let selectedCampaignData = localStorage.getItem("campaignData");
        let PromptData = JSON.parse(localStorage.getItem("prompt"));

        for (const prompt of PromptData) {
          await EnrichmentDataToRedux(
            selectedClientData,
            selectedCampaignData,
            prompt
          );
        }

        try {
          setSelectedFile(null);

          //call uploadcsv function to upload file
          await uploadCsv(formData);

          let c = 0;
          for (const prompt of PromptData) {
            const encodedCampaignName = encodeURIComponent(selectedCampaign);

            //call enrich csv funtion to enrich records
            await enrichCsv(
              selectedClient,
              encodedCampaignName,
              prompt,
              c,
              ip,
              userID,
              recordIndex
            );
            c++;
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        let PromptData = JSON.parse(localStorage.getItem("prompt"));
        let selectedClientData = localStorage.getItem("clientData");
        let selectedCampaignData = localStorage.getItem("campaignData");

        let c = 0;
        for (const prompt of PromptData) {
          await EnrichmentDataToRedux(
            selectedClientData,
            selectedCampaignData,
            prompt
          );

          const encodedCampaignName = encodeURIComponent(selectedCampaign);

          //call enrich csv funtion to enrich records
          await enrichCsv(
            selectedClient,
            encodedCampaignName,
            prompt,
            c,
            ip,
            userID,
            recordIndex
          );

          c++;
        }
        resetClientAndCampaign();
      }
    }
  };

  return (
    <Box mt="20px" px={{ base: "", md: "40px" }}>
      <Heading fontSize="2xl" fontWeight="600">
        Upload Leads for enrichments
      </Heading>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <InputField
          clients={clients}
          loadingClients={loadingClients}
          setProgressCount={setProgressCount}
          setTotalCount={setTotalCount}
        />

        <InputFieldCampaign
          campaigns={campaignsClient}
          loadingCampaign={loadingCampaign}
        />

        <Box mb="4">
          <Flex direction="row">
            <Button
              colorScheme={buttonColor}
              style={{
                marginLeft: "20px",
                width: "100px",
                marginRight: "5px",
              }}
              onClick={handleFileUpload}
            >
              {"Select file"}
            </Button>
            {selectedFile ? selectedFile?.name : ""}
          </Flex>
        </Box>
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => handleFileInputChange(e)}
          ref={fileInputRef}
        />
      </div>
      <>
        <Box mt="40px">
          <CheckboxGroup value={selectedCheckboxes} colorScheme={buttonColor}>
            <Stack spacing={[1, 2]} direction={["column"]}>
              <Checkbox
                value="Better Titles ENG"
                onChange={() => handleCheckboxChange("Better Titles ENG")}
              >
                Better Titles ENG
              </Checkbox>
              <Checkbox
                value="Basic Enrichment ENG"
                onChange={() => handleCheckboxChange("Basic Enrichment ENG")}
              >
                Basic Enrichment ENG
              </Checkbox>
              <Checkbox
                value="Basic Enrichment SE"
                onChange={() => handleCheckboxChange("Basic Enrichment SE")}
              >
                Basic Enrichment SE
              </Checkbox>
            </Stack>
          </CheckboxGroup>
          <Box>
            <Flex direction="column">
              <Button
                mt="20px"
                colorScheme={buttonColor}
                style={{ width: "150px" }}
                onClick={handleFileChange}
                isDisabled={
                  recordIndex.some(
                    (enrich) =>
                      enrich?.client === selectedClient &&
                      enrich?.campaign === selectedCampaign &&
                      selectedCheckboxes.includes(enrich.prompt)
                  ) ||
                  selectedClient === null ||
                  selectedCampaign === ""
                }
              >
                {recordIndex.some(
                  (enrich) =>
                    enrich?.client === selectedClient &&
                    enrich?.campaign === selectedCampaign &&
                    selectedCheckboxes.includes(enrich.prompt)
                )
                  ? "Already Running"
                  : "Start"}
              </Button>

              <Text style={{ color: "red", marginTop: "10px" }}>
                {showEmailFieldError !== "" && showEmailFieldError}
              </Text>
              <Text style={{ color: "red", marginTop: "10px" }}>
                {showPromptError && showPromptError}
              </Text>
            </Flex>
          </Box>

          <div style={{ marginTop: "10px" }}>
            {showProgress && totalCount === "" && (
              <Progress size="xs" isIndeterminate />
            )}
          </div>
          {totalCount && (
            <>
              {progressCount?.progress} / {totalCount}{" "}
            </>
          )}
        </Box>
      </>
    </Box>
  );
}
