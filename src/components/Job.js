import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text,
  Heading,
  Stack,
  Skeleton,
  keyframes,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { buttonColor } from "../shared/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { addEnrichmentDataFromDb } from "../redux/actions";
import { fetchRecords, download_CSV } from "./api";

export default function Jobs() {
  return (
    <Box mt="20px" px={{ base: "", md: "40px" }}>
      <Box mt="20px" display="flex" gap="20px" flexDir="column">
        <Job />
      </Box>
    </Box>
  );
}

const Job = () => {
  const [loading, setLoading] = useState(true);

  //state
  const SOCKETURL = useSelector((state) => state?.socket?.socketURL);
  const enrich = useSelector((state) => state?.enrichment.enrichmentArray);
  const EnrichmentRecords = useSelector((state) => state?.record?.records);
  const reversedRecords = EnrichmentRecords.slice().reverse();

  const EnrichmentRecordsRedux = useSelector(
    (state) => state?.recordRedux?.records
  );
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (SOCKETURL) {
      SOCKETURL.on("on-db-doc-finished", async (index) => {
        console.log("on-db-doc-finished", index);
// fetch records from DB 
        let response = await fetchRecords();
        dispatch(addEnrichmentDataFromDb(response.stats));
        setLoading(false);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        //fetch reords from DB
        let response = await fetchRecords();
        dispatch(addEnrichmentDataFromDb(response.stats));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
  
    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

// call download function
  const downloadCSV = async (enrich, campaign, prompt) => {
    try {
      const encodedCampaignName = encodeURIComponent(campaign);
      // download api call
      const res =  await download_CSV(enrich, encodedCampaignName, prompt)

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${enrich}-${campaign}.csv`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const animationKeyframes = keyframes`
  0% { transform: scale(1); border-radius: 20%; }
  25% { transform: scale(1) ; border-radius: 20%; }
  50% { transform: scale(1.1) ; border-radius: 50%; }
  75% { transform: scale(1) ; border-radius: 50%; }
  100% { transform: scale(1) ; border-radius: 20%; }
`;
  const animation = `${animationKeyframes} 2s ease-in-out infinite`;

  // return the percetage of records enriched
  function getPercentageOfRecords(enrichedNumber, totalNumber) {
    const enriched = parseFloat(enrichedNumber);
    const total = parseFloat(totalNumber);

    if (isNaN(enriched) || isNaN(total) || total === 0) {
      return ""; // Display an empty space for non-numeric or zero total
    }

    return ((enriched / total) * 100).toFixed(2) + "%";
  }

  // return avrage time of enrichment process
  function getAverageTime(totalNumber) {
    const total = parseFloat(totalNumber);

    if (isNaN(total) || total === 0) {
      return ""; // Display an empty space for non-numeric or zero total
    }

    const resultInSeconds = 0.06 * total;
    const resultInMinutes = (resultInSeconds / 60).toFixed(3);

    return `${resultInSeconds}s Avg per row ETA- ${resultInMinutes} min`;
  }

  return (
    <div>
      {loading ? (
        <></>
      ) : EnrichmentRecordsRedux?.length === 0 &&
        EnrichmentRecords.length === 0 ? (
        <>
          <Text fontSize={{ base: "md", md: "2xl" }} fontWeight="bold">
            No Enrichment Records
          </Text>
        </>
      ) : null}
      {loading ? (
        <></>
      ) : EnrichmentRecordsRedux?.length > 0 ? (
        <>
          <Heading fontSize="2xl" fontWeight="600" mb={4}>
            Current Enrichment Jobs Running
          </Heading>
          {EnrichmentRecordsRedux.reverse().map((enrich) => (
            <Box style={{ marginTop: "20px" }}>
              <Card>
                <CardHeader fontWeight="600">
                  {enrich?.client === "" && enrich?.campaign === "" ? (
                    <Stack>
                      <Skeleton height="20px" />
                    </Stack>
                  ) : (
                    <>
                      {enrich?.client} - {enrich?.campaign}
                    </>
                  )}
                </CardHeader>

                <CardBody>
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Box>
                        {enrich.stats === "" ? (
                          <Stack>
                            <Skeleton height="20px" width="400px" />
                          </Stack>
                        ) : (
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            {enrich?.prompt}-{""}
                            {enrich?.stats && (
                              <>
                                <Text animation={animation}>
                                  {enrich?.stats?.totalEnrichmentRun}/
                                  {enrich?.stats?.totalRecords}
                                </Text>

                                <Text
                                  style={{
                                    marginLeft: "35px",
                                    fontSize: 16,
                                  }}
                                >
                                  {getAverageTime(enrich?.stats?.totalRecords)}{" "}
                                </Text>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    marginLeft: "30px",
                                    fontSize: 20,
                                  }}
                                >
                                  {getPercentageOfRecords(
                                    enrich?.stats?.totalEnrichmentRun,
                                    enrich?.stats?.totalRecords
                                  )}{" "}
                                </span>
                              </>
                            )}
                          </Flex>
                        )}
                        <>
                          <Text>
                            Enriched Records: {enrich?.stats?.enrichedNumber}
                          </Text>
                          <Text>
                            Invalid Website URL :{" "}
                            {enrich?.stats?.totalEnrichmentRun -
                              enrich?.stats?.enrichedNumber}
                          </Text>

                          <Text>
                            Faulty Uploads: {enrich?.stats?.faultyUploads}
                          </Text>
                        </>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDir="column"
                      gap="10px"
                    >
                      <Box>
                        <Flex flexDirection="column">
                          <Button
                            colorScheme={buttonColor}
                            variant="outline"
                            onClick={() =>
                              downloadCSV(
                                enrich.client,
                                enrich.campaign,
                                enrich?.prompt
                              )
                            }
                          >
                            Download
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </Box>
          ))}
        </>
      ) : null}
      {loading ? (
        <Box style={{ marginTop: "20px" }}>
          <Card>
            <CardHeader fontWeight="600">
              <Stack>
                <Skeleton height="20px" width="300px" />
              </Stack>
            </CardHeader>

            <CardBody>
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Box>
                    <Stack>
                      <Skeleton height="20px" width="300px" />
                    </Stack>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  flexDir="column"
                  gap="10px"
                >
                  <Box>
                    <Flex flexDirection="column">
                      <Button
                        colorScheme={buttonColor}
                        variant="outline"
                        onClick={() =>
                          downloadCSV(
                            enrich.client,
                            enrich.campaign,
                            enrich?.prompt
                          )
                        }
                      >
                        <Stack>
                          <Skeleton height="20px" width="100px" />
                        </Stack>{" "}
                      </Button>
                      <Button
                        colorScheme={buttonColor}
                        style={{ marginTop: "10px" }}
                        variant="outline"
                      >
                        <Stack>
                          <Skeleton height="20px" width="100px" />
                        </Stack>{" "}
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </Box>
      ) : (
        <>
          {EnrichmentRecords?.length > 0 ? (
            <>
              <Heading fontSize="2xl" fontWeight="600" mb={4} mt={4}>
                Previous Enrichment Jobs
              </Heading>
              {reversedRecords.map((enrich) => (
                <Box style={{ marginTop: "20px" }}>
                  <Card>
                    <CardHeader fontWeight="600">
                      {enrich?.client === "" && enrich?.campaign === "" ? (
                        <Stack>
                          <Skeleton height="20px" />
                        </Stack>
                      ) : (
                        <>
                          {enrich?.client} - {enrich?.campaign}
                        </>
                      )}
                    </CardHeader>

                    <CardBody>
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Box>
                            {enrich.stats === "" ? (
                              <Stack>
                                <Skeleton height="20px" width="400px" />
                              </Stack>
                            ) : (
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                {enrich.prompt}-{""}
                                {enrich?.stats && (
                                  <>
                                    <Text>
                                      {enrich?.stats?.totalEnrichmentRun}/
                                      {enrich?.stats?.totalRecords}
                                    </Text>

                                    <Text
                                      style={{
                                        marginLeft: "35px",
                                        fontSize: 16,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Enrichment Completed
                                    </Text>
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        marginLeft: "30px",
                                        fontSize: 20,
                                      }}
                                    ></span>
                                  </>
                                )}
                              </Flex>
                            )}
                            <>
                              <Text>
                                Enriched Records:{" "}
                                {enrich?.stats?.enrichedNumber}
                              </Text>
                              <Text>
                                Invalid Website URL :{" "}
                                {enrich?.stats?.totalEnrichmentRun -
                                  enrich?.stats?.enrichedNumber}
                              </Text>

                              <Text>
                                Faulty Uploads: {enrich?.stats?.faultyUploads}
                              </Text>
                            </>
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          flexDir="column"
                          gap="10px"
                        >
                          <Box>
                            <Flex flexDirection="column">
                              <Button
                                colorScheme={buttonColor}
                                variant="outline"
                                onClick={() =>
                                  downloadCSV(
                                    enrich.client,
                                    enrich.campaign,
                                    enrich?.prompt
                                  )
                                }
                              >
                                Download
                              </Button>
                            </Flex>
                          </Box>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </Box>
              ))}
            </>
          ) : null}
        </>
      )}
    </div>
  );
};
