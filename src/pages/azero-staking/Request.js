import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Stack, Tooltip } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function Request() {
  const { currentAccount } = useSelector((s) => s.wallet);

  const stakingInfo = prepareStakingInfo();

  const [stakeAmount, setStakeAmount] = useState("");

  function handleRequestClaim() {
    alert("handleRequestClaim");
  }

  return (
    <IWCard w="full" variant="outline" title={`Staking Information`}>
      <Stack
        mt="18px"
        w="100%"
        spacing="8px"
        direction={{ base: "column" }}
        align={{ base: "column", xl: "center" }}
      >
        {stakingInfo?.map((i) => (
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
              onClick={() => handleRequestClaim()}
            >
              {currentAccount?.address
                ? "Request to withdraw"
                : "Connect Wallet"}
            </Button>
          </Stack>
        </IWCard>
      </Stack>
    </IWCard>
  );
}

export default Request;

function prepareStakingInfo() {
  return [
    {
      title: "My stakes",
      number: 888,
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Last claim",
      number: "Not claim yet",
      denom: "",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "AZERO Unclaimed Rewards",
      number: 9999.8888,
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "INW Unclaimed Rewards",
      number: 88889999.8888,
      denom: "INW",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
  ];
}
