import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import SectionContainer from "components/container/SectionContainer";
import { useAppContext } from "contexts/AppContext";
import { useSwapV2TokenContext } from "contexts/SwapV2TokenModalContext";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import {
  formatNumDynDecimal,
  formatTextAmount,
  formatTokenAmount,
  getPublicCurrentAccount,
} from "utils";
import { execContractQuery } from "utils/contracts";
import { psp22_contract } from "utils/contracts";
import { psp22_contract_v2 } from "utils/contracts";
import { swap_inw2_contract } from "utils/contracts";

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
        formatTokenAmount(contractBalance, 12) - +inwTotalSupply;
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
        right={
          isMobile ? null : (
            <Button onClick={() => openSwapModal()}>Swap Now</Button>
          )
        }
        mt={{ base: "0px", xl: "20px" }}
        title="INW V2 Tokens"
        description={
          <>
            INW (which has been upgraded to INW version 2 via SWAP feature) is
            the core token of Ink Whale platform. You will need to acquire INW
            to be able to use the platform features.
          </>
        }
      >
        {isMobile && (
          <Button mb="8px" onClick={() => openSwapModal()}>
            Swap Now
          </Button>
        )}
        <Box __css={styles}>
          <Heading as="h4" size="h4" lineHeight="25px">
            Ink Whale Token (INW V2)
          </Heading>
          <Box mt="14px" pt="0px" w="full" borderTop="1px solid #E3DFF3">
            <SimpleGrid
              columns={{
                base: 1,
                lg: 4,
              }}
              spacing="4px"
            >
              {[
                {
                  title: "Contract Address",
                  content: (
                    <AddressCopier
                      address={psp22_contract_v2.CONTRACT_ADDRESS}
                    />
                  ),
                },
                {
                  title: "In Circulation ",
                  content: `${inwV2Info?.inwInCur || 0} INW V2`,
                },
                {
                  title: "Total Burned",
                  content: `${inwV2Info?.inwBurn || 0} INW V2`,
                },
                {
                  title: "Your Balance: ",
                  content: `${
                    currentAccount?.balance?.inw2
                      ? formatNumDynDecimal(
                          formatTextAmount(currentAccount?.balance?.inw2)
                        )
                      : 0
                  } INW V2`,
                },
              ]?.map(({ title, content }, idx) => {
                return (
                  <Box key={idx} my={{ base: "12px", lg: "12px" }}>
                    <Text fontSize="md" lineHeight="28px">
                      {title}{" "}
                    </Text>

                    <Heading as="h4" size="h4" mt="2px" fontWeight="semibold">
                      {content}
                      {/* <AzeroLogo /> */}
                    </Heading>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        </Box>
      </SectionContainer>
    </>
  );
};

export default INWV2;
