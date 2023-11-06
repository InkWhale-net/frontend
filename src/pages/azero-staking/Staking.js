import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Stack, Tooltip } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function Staking() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const footerInfo = prepareFooterInfo();
  const statsInfo = prepareStatsInfo();

  const [stakeAmount, setStakeAmount] = useState("");

  function handleStake() {
    alert("handleStake");
  }

  return (
    <>
      <IWCard w="full" variant="solid">
        <Stack
          w="100%"
          spacing="20px"
          direction={{ base: "column" }}
          align={{ base: "column", xl: "center" }}
        >
          <IWInput
            type="number"
            placeholder="0"
            value={stakeAmount}
            onChange={({ target }) => setStakeAmount(target.value)}
            inputRightElementIcon={
              <Button
                size="xs"
                fontWeight="normal"
                onClick={() => setStakeAmount(999)}
              >
                Max
              </Button>
            }
          />

          <Button
            w="full"
            isDisabled={!currentAccount?.address || !stakeAmount}
            onClick={() => handleStake()}
          >
            {currentAccount?.address ? "Stake" : "Connect Wallet"}
          </Button>

          {footerInfo?.map((i) => (
            <>
              <Flex
                key={i?.title}
                w="full"
                justify="space-between"
                direction={["column", "row"]}
              >
                <Flex alignItems="center">
                  {i?.title}
                  {i?.hasTooltip && (
                    <Tooltip fontSize="md" label={i?.tooltipContent}>
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  )}
                </Flex>
                <Box
                  color={{ base: "#57527E" }}
                  fontWeight={{ base: "bold" }}
                  fontSize={["16px", "18px"]}
                >
                  {i.number} {i.denom}
                </Box>
              </Flex>
            </>
          ))}
        </Stack>
      </IWCard>

      <IWCard w="full" variant="outline" title={`Statistics`} mt="18px">
        <Stack
          mt="18px"
          w="100%"
          spacing="20px"
          direction={{ base: "column" }}
          align={{ base: "column", xl: "center" }}
        >
          {statsInfo?.map((i) => (
            <>
              <Flex
                key={i?.title}
                w="full"
                justify="space-between"
                direction={["column", "row"]}
              >
                <Flex alignItems="center">
                  {i?.title}
                  {i?.hasTooltip && (
                    <Tooltip fontSize="md" label={i?.tooltipContent}>
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  )}
                </Flex>
                <Box
                  color={{ base: "#57527E" }}
                  fontWeight={{ base: "bold" }}
                  fontSize={["16px", "18px"]}
                >
                  {i.number} {i.denom}
                </Box>
              </Flex>
            </>
          ))}
        </Stack>
      </IWCard>
    </>
  );
}

export default Staking;

function prepareFooterInfo() {
  return [
    {
      title: "Min staking amount",
      number: 99,
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Max total staking amount",
      number: 88899,
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Staked amount",
      number: 99,
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
  ];
}

function prepareStatsInfo() {
  return [
    {
      title: "Annual Percentage Rate",
      number: 7.0,
      denom: "%",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Total Staked",
      number: 88899,
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Stakers",
      number: 12321,
      denom: "",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
  ];
}
