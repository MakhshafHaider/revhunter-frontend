"use client";

import {
  Flex,
  Box,
  Stack,
  Heading,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { CLIENTID } from "../config";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoggedInAction } from "../redux/actions";
import { LoginUser } from "./api";

export default function Login() {
  const [error, setError] = useState("");

  const history = useNavigate();
  const dispatch = useDispatch();

  //get the response from the google api
  const sendDecodedData = async (decodedData) => {
    const url = `${BASEURL}login/user`;

    const { name, email } = decodedData;

    const data = {
      name,
      email,
    };

    // call login function
    const response = await LoginUser(url, data);

    if (response?.result?.email || response?.result?.user?.email) {
      if (
        response.result.email?.endsWith("@revhuntr.com") ||
        response.result.email?.endsWith("@contrivers.dev") ||
        response.result?.user?.email?.endsWith("@revhuntr.com") ||
        response.result?.user?.email?.endsWith("@contrivers.dev")
      ) {
        if (response?.result?._id) {
          dispatch(setLoggedInAction(response.result._id));
        } else {
          dispatch(setLoggedInAction(response.result.user._id));
        }
        history("/");
      } else {
        console.log("Error: Email does not meet the required domain criteria.");
        setError(
          "Please note that only email addresses ending with '@revhuntr.com' are permitted for login."
        );
      }
    } else {
      console.log("Error: Email not found in response.");
      // setError("Email address not found in the response data.");
    }

    // history("/home");
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4} alignItems={"center"} justify={"center"}>
            <GoogleOAuthProvider clientId={CLIENTID}>
              <div style={{ width: "200px" }}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    let decode = jwtDecode(credentialResponse.credential);
                    // console.log("decode", decode);
                    sendDecodedData(decode);
                  }}
                  onError={(error) => {
                    console.log("Login Failed", error);
                  }}
                />
              </div>
            </GoogleOAuthProvider>
            {error && (
              <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
            )}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
