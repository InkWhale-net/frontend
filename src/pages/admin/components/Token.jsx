import { Button } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import { useAppContext } from "contexts/AppContext";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatNumToBN } from "utils";
import { execContractTx } from "utils/contracts";
import { psp22_standard_contract } from "utils/contracts/contract";

const Token = () => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const mintTestnetTokenHandler = async () => {
    execContractTx(
      currentAccount,
      api,
      psp22_standard_contract.CONTRACT_ABI,
      psp22_standard_contract.CONTRACT_ADDRESS,
      0,
      "psp22Mintable::mint",
      currentAccount.address,
      "1000000000000000"
    );
  };
  return (
    <SectionContainer mt={{ base: "0px", xl: "20px" }} title="TOKEN ADMIN">
      <Button
        onClick={() => {
          mintTestnetTokenHandler();
        }}
      >
        Mint testnet token
      </Button>
    </SectionContainer>
  );
};
export default Token;
