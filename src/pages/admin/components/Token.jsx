import { Button } from "@chakra-ui/react";
import { BN } from "@polkadot/util";
import SectionContainer from "components/container/SectionContainer";
import { useAppContext } from "contexts/AppContext";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatNumToBNEther } from "utils";
import { formatNumToBN } from "utils";
import { token_generator_contract } from "utils/contracts";
import { psp22_contract } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import { execContractTx } from "utils/contracts";

const Token = () => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const mintTestnetTokenHandler = async () => {
    // const queryResult = await execContractTx(
    //   currentAccount?.address,
    //   api,
    //   token_generator_contract.CONTRACT_ABI,
    //   token_generator_contract.CONTRACT_ADDRESS,
    //   0,
    //   "tokenManagerTrait::setCreationFee",
    //   // currentAccount.address,
    //   formatNumToBNEther(1)
    // );
    console.log(formatNumToBNEther(1).toString());
    // execContractTx(
    //   {
    //     ...currentAccount,
    //     address: "5Gdqf8ReK3Gbd5DgdxF6fij7WehSNb5hVoEXwk1poFrgFEgt",
    //   },
    //   api,
    //   token_generator_contract.CONTRACT_ABI,
    //   token_generator_contract.CONTRACT_ADDRESS,
    //   0,
    //   "tokenManagerTrait::setCreationFee",
    //   formatNumToBNEther(1)
    // );

    // const queryResult = await execContractQuery(
    //   currentAccount?.address,
    //   api,
    //   psp22_contract.CONTRACT_ABI,
    //   psp22_contract.CONTRACT_ADDRESS,
    //   0,
    //   "psp22Mintable::mint",
    //   currentAccount.address,
    //   formatNumToBN(1000000)
    // );
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
