import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { BASEURL } from "../config";
export default function EmailSetup() {
  const [selectFile, setSelectedFile] = useState("");
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };
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
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file?.name);
      console.log("File selected:", file.name);
      const formData = new FormData();
      formData.append('file', file);
      const csvHeaders = (await getCsvHeaders(file)).map((header) =>
      header.trim().replace("/r", "")
    );
   console.log('scv headers', csvHeaders);
      try {
        const response = await axios.post(`${BASEURL}upload-csv-leads`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("response are:", response);
        alert('File uploaded successfully');
      } catch (error) {
        // alert('Error while uploading file');
        console.error('There was an error!', error);
      }
    }
  };
  return (
    <Box mt="20px" px={{ base: "", md: "40px" }}>
      <Heading fontSize="2xl" fontWeight="600" mb={4}>
        Activate and Setup inboxes
      </Heading>
      <Flex>
        <Button
          colorScheme="blue"
          variant="outline"
          height={"auto"}
          width={"40%"}
          onClick={handleFileButtonClick}
        >
          {selectFile ? selectFile : "Upload csv"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the file input
          accept=".csv"
        />
        <Stack spacing={3} width={"50%"} ml={4}>
          <Input variant="outline" placeholder="Max emails per day (number)" />
          <Input variant="outline" placeholder="Signature {first_name}" />
          <Input variant="outline" placeholder="login URL" />
        </Stack>
      </Flex>
      <Button colorScheme="blue" mt={4}>
        Activate
      </Button>
    </Box>
  );
}
