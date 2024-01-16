import { Button } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import { useAppContext } from "contexts/AppContext";
import { useSelector } from "react-redux";
import { formatNumToBNEther } from "utils";
import { execContractTx, psp22_contract } from "utils/contracts";

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

    const queryResult = await execContractTx(
      currentAccount,
      api,
      psp22_contract.CONTRACT_ABI,
      psp22_contract.CONTRACT_ADDRESS,
      0,
      "psp22Mintable::mint",
      currentAccount.address,
      "10000000000000000000"
    );
    // const queryResult = await execContractTx(
    //   currentAccount,
    //   api,
    //   psp22_contract.CONTRACT_ABI,
    //   psp22_contract.CONTRACT_ADDRESS,
    //   0,
    //   "accessControl::grantRole",
    //   "4254773782",
    //   currentAccount.address,
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
