import axios from "axios";
import { BASEURL } from "../../config";

// get clients data from db
export const getClients = async () => {
  const response = await axios.get(`${BASEURL}clients`);
  return response;
};

//get campaigns from db for particular client
export const getCampaignsfromDB = async (clientName) => {
  const response = await axios.get(`${BASEURL}clients/${clientName}/campaigns`);

  return response;
};

//get current ip address.
export const ipAddressValue = async () => {
  const response = await axios.get("https://api.ipify.org/?format=json");
  return response;
};

//upload csv file to db
export const uploadCsv = async (formData) => {
  await axios.post(`${BASEURL}upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// enrich uploaded csv data
export const enrichCsv = async (
  selectedClient,
  encodedCampaignName,
  prompt,
  c,
  ip,
  userID,
  recordIndex
) => {
  await axios.post(
    `${BASEURL}clients/${selectedClient}/${encodedCampaignName}/enrich`,
    {
      prompt: prompt,
      index: c + recordIndex.length,
      ip: ip,
      userID,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// to Login  user
export const LoginUser = async (url,data) => {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  
  }


  /// ftech records of stats

export  const fetchRecords = async () => {
    const apiUrl = `${BASEURL}records/data`;

    const response = await axios.get(apiUrl);
    return response.data;
  };

  //download csv 
  
  export const download_CSV = async (enrich, encodedCampaignName, prompt) => {
    const response =  await axios.get(
      `${BASEURL}clients/${enrich}/${encodedCampaignName}/${prompt}/download`,
      {
        responseType: "blob",
      }
    );
    return response;
  }  