import React, { useState } from "react";
import SectionContainer from "components/container/SectionContainer";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Button,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "contexts/AppContext";

const loginPass = process.env.REACT_APP_LOGIN_PASSWORD;
export default function LoginPage() {
  //   const [password, setPassword] = useState("");
  const { password, setPassword, setIsLogin } = useAppContext();
  const history = useHistory();
  const handleInputChange = (e) => setPassword(e.target.value);
  const isError = password === "";

  const handleLogin = () => {
    if (password === loginPass) {
      localStorage.setItem("localLoginPass", password);
      toast.success("Login sussces!");
      setIsLogin(true);
      history.push("/");
    } else {
      toast.error("Wrong password!");
    }
  };

  const handleLogOut = () => {
    if (password === loginPass) {
      localStorage.setItem("localLoginPass", "");
      toast.success("Login sussces!");
      setIsLogin(false);
      history.push("/");
    } else {
      toast.error("Wrong password!");
    }
  };
  return (
    <SectionContainer maxW="1800px" mt={{ base: "0px", xl: "20px" }}>
      <Text fontSize={"4xl"}>Login</Text>
      <FormControl isInvalid={isError} mt={"24px"}>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={handleInputChange} />
        {!isError ? (
          <FormHelperText>Enter the password.</FormHelperText>
        ) : (
          <FormErrorMessage>Password is required.</FormErrorMessage>
        )}
        <Box mt={"24px"}>
          <Button colorScheme="blue" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </FormControl>
    </SectionContainer>
  );
}
