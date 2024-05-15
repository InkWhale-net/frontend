import { Box, Stack, useStyleConfig } from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCardOneColumn from "components/card/CardOneColumn";
import SectionContainer from "components/container/SectionContainer";
import { useAppContext } from "contexts/AppContext";
import { useSwapV2TokenContext } from "contexts/SwapV2TokenModalContext";
import SwapTab from "pages/account/bridge/swap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatChainStringToNumber } from "utils";
import {
  formatNumDynDecimal,
  formatTextAmount,
  formatTokenAmount,
  getPublicCurrentAccount,
} from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import swap_inw2_contract from "utils/contracts/swap_inw2_contract";

const INWV2 = () => {
  const [inwV2Info, setInwV2Info] = useState(null);
  const publicCurrentAccount = getPublicCurrentAccount();
  const { currentAccount } = useSelector((s) => s.wallet);
  const styles = useStyleConfig("IWCard", { variant: "outline" });
  const { api } = useAppContext();
  const { openSwapModal } = useSwapV2TokenContext();
  const fetchINWV2Info = async () => {
    try {
      const query1 = await execContractQuery(
        publicCurrentAccount?.address,
        api,
        psp22_contract_v2.CONTRACT_ABI,
        psp22_contract_v2.CONTRACT_ADDRESS,
        0,
        "psp22::totalSupply"
      );
      const totalSupply = query1?.toHuman()?.Ok;
      const inwTotalSupply = formatTokenAmount(totalSupply, 12);
      const query2 = await execContractQuery(
        publicCurrentAccount?.address,
        api,
        psp22_contract.CONTRACT_ABI,
        psp22_contract.CONTRACT_ADDRESS,
        0,
        "psp22::balanceOf",
        swap_inw2_contract.CONTRACT_ADDRESS
      );

      const contractBalance = query2?.toHuman()?.Ok;
      const totalBurn =
        formatChainStringToNumber(formatTokenAmount(contractBalance, 12)) -
        +formatChainStringToNumber(inwTotalSupply);
      setInwV2Info({
        inwInCur: formatNumDynDecimal(inwTotalSupply),
        inwBurn: formatNumDynDecimal(totalBurn),
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (api) fetchINWV2Info();
  }, [api]);
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="INW2 Tokens"
        description={
          <>
            INW (which has been upgraded to Ink Whale Token V2 via SWAP feature)
            is the core token of Ink Whale platform. You will need to acquire
            INW to be able to use the platform features.
          </>
        }
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column", lg: "row" }}
        >
          <IWCardOneColumn
            title="Ink Whale Token V2"
            data={[
              {
                title: "Contract Address",
                content: (
                  <AddressCopier address={psp22_contract_v2.CONTRACT_ADDRESS} />
                ),
              },
              {
                title: "In Circulation ",
                content: `${inwV2Info?.inwInCur || 0} INW2`,
              },
              {
                title: "Total Burned",
                content: `${inwV2Info?.inwBurn || 0} INW2`,
              },
              {
                title: "Your Balance: ",
                content: `${
                  currentAccount?.balance?.inw2
                    ? formatNumDynDecimal(
                        formatTextAmount(currentAccount?.balance?.inw2)
                      )
                    : 0
                } INW2`,
              },
            ]}
          />
          <Box w={"full"}>
            <SwapTab />
          </Box>
        </Stack>
      </SectionContainer>
    </>
  );
};

export default INWV2;
