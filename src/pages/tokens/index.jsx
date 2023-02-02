import { Box, Button, Heading, Select, Show, Stack } from "@chakra-ui/react";
import { APICall } from "api/client";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import IWTabs from "components/tabs/IWTabs";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatChainStringToNumber } from "utils";
import { formatQueryResultToNumber } from "utils";
import { delay } from "utils";
import { formatNumToBN } from "utils";
import { isAddressValid } from "utils";
import { addressShortener } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";

export default function TokensPage() {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [selectedContractAddr, setSelectedContractAddr] = useState("");
  const [faucetTokensList, setFaucetTokensList] = useState([]);
  const [tokenInfo, setTokenInfo] = useState({ title: "", content: "" });
  useEffect(() => {
    let isUnmounted = false;
    const getFaucetTokensListData = async () => {
      let { ret, status, message } = await APICall.getTokensList({});

      if (status === "OK") {
        if (isUnmounted) return;

        return setFaucetTokensList(ret);
      }

      toast.error(`Get faucet tokens list failed. ${message}`);
    };
    getFaucetTokensListData();
    return () => (isUnmounted = true);
  }, []);

  async function loadTokenInfo() {
    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return setTokenInfo({ title: "", content: "" });
    }

    if (!isAddressValid(selectedContractAddr)) {
      toast.error("Invalid address!");
      return;
    }

    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const balance = formatQueryResultToNumber(queryResult);

    let queryResult1 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22Metadata::tokenSymbol"
    );
    const tokenSymbol = queryResult1.toHuman().Ok;

    setTokenInfo((prev) => {
      return { ...prev, title: tokenSymbol, content: balance };
    });
  }
  const tabsData = [
    {
      label: <>Check Balance</>,
      component: (
        <TokensTabCheckBalance
          mode="BALANCE_CHECK"
          {...currentAccount}
          tokenInfo={tokenInfo}
          selectedContractAddr={selectedContractAddr}
        />
      ),
      isDisabled: false,
    },
    {
      label: (
        <>
          Transfer<Show above="md"> Token</Show>
        </>
      ),
      component: (
        <TokensTabTransferToken
          mode="TRANSFER_TOKEN"
          {...currentAccount}
          tokenInfo={tokenInfo}
          selectedContractAddr={selectedContractAddr}
          loadTokenInfo={loadTokenInfo}
        />
      ),
      isDisabled: false,
    },
    {
      label: (
        <>
          Burn<Show above="md"> Token</Show>
        </>
      ),
      component: (
        <TokensTabBurnToken
          mode="BURN_TOKEN"
          {...currentAccount}
          tokenInfo={tokenInfo}
          selectedContractAddr={selectedContractAddr}
          loadTokenInfo={loadTokenInfo}
        />
      ),
      isDisabled: false,
    },
  ];

  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Token Interaction"
        description={
          <span>Check token information, transfer or burn tokens.</span>
        }
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column" }}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="full"
              spacing="20px"
              alignItems={{ base: "end" }}
              flexDirection={{ base: "column", lg: "row" }}
            >
              <Box w="full" pr={{ lg: "10px" }}>
                <Heading as="h4" size="h4" mb="12px">
                  Token Contract Address
                </Heading>
                <Select
                  label="Token Contract Address"
                  value={selectedContractAddr}
                  // isDisabled={accountInfoLoading}
                  id="token"
                  placeholder="Select token"
                  onChange={({ target }) => {
                    setSelectedContractAddr(target.value);
                  }}
                >
                  {faucetTokensList?.map((token, idx) => (
                    <option key={idx} value={token.contractAddress}>
                      {token?.symbol} ({token?.name}) -{" "}
                      {addressShortener(token?.contractAddress)}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box w="full" pr={{ lg: "20px" }}>
                <IWInput
                  onChange={({ target }) =>
                    setSelectedContractAddr(target.value)
                  }
                  value={selectedContractAddr}
                  placeholder="Address to check"
                  label="or enter token contract address"
                />
              </Box>

              <Button
                onClick={loadTokenInfo}
                w="full"
                maxW={{ base: "full", lg: "190px" }}
              >
                Load
              </Button>
            </Stack>
          </IWCard>

          <IWTabs tabsData={tabsData} />
        </Stack>
      </SectionContainer>
    </>
  );
}

const TokensTabCheckBalance = ({
  mode,
  address,
  tokenInfo,
  balance,
  selectedContractAddr,
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [addressCheckBalance, setAddressCheckBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);

  async function checkBalanceHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }

    if (!isAddressValid(addressCheckBalance)) {
      return toast.error("Invalid address!");
    }

    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::balanceOf",
      addressCheckBalance
    );

    const bal = formatQueryResultToNumber(queryResult);

    setTokenBalance(bal);
  }
  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <IWCardOneColumn
        title="My Account"
        data={[
          {
            title: "Account Address",
            content: !address
              ? "No account selected"
              : addressShortener(address),
          },
          {
            title: "Azero Balance",
            content: `${balance?.azero || 0} AZERO`,
          },
          { title: "INW Balance", content: `${balance?.inw || 0} INW` },
          {
            title: !tokenInfo?.title ? "" : `${tokenInfo?.title} Balance`,
            content: `${tokenInfo?.content} ${tokenInfo?.title}`,
          },
        ]}
      />

      <IWCard
        w="full"
        variant="outline"
        title={`Enter any address to check ${tokenInfo?.title} balance`}
      >
        <IWCard mt="16px" w="full" variant="solid">
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              value={addressCheckBalance}
              onChange={({ target }) => setAddressCheckBalance(target.value)}
              placeholder="Address you want to check balance"
            />

            <IWInput
              value={tokenBalance}
              isDisabled={true}
              placeholder="0"
              inputRightElementIcon={
                <Heading as="h5" size="h5" fontWeight="semibold">
                  {tokenInfo?.title}
                </Heading>
              }
            />

            <Button onClick={() => checkBalanceHandler()} w="full">
              Check
            </Button>
          </Stack>
        </IWCard>
      </IWCard>
    </Stack>
  );
};

const TokensTabTransferToken = ({
  mode,
  address,
  balance,
  tokenInfo,
  selectedContractAddr,
  loadTokenInfo,
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);

  async function transferTokenHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }

    if (!isAddressValid(transferAddress)) {
      return toast.error("Invalid address!");
    }

    if (transferAmount === 0 || !transferAmount) {
      toast.error("Please enter amount to transfer!");
      return;
    }

    if (transferAmount > formatChainStringToNumber(tokenInfo?.content)) {
      toast.error(
        `You don't have enough ${tokenInfo?.title} tokens to transfer!`
      );
      return;
    }

    if (balance?.azero < 0.05) {
      toast.error("Low Azero balance!");
      return;
    }

    await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0, //-> value
      "psp22::transfer",
      transferAddress,
      formatNumToBN(transferAmount),
      []
    );

    await delay(2000).then(() => {
      setTransferAddress("");
      setTransferAmount(0);
      loadTokenInfo();
    });
  }

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <IWCardOneColumn
        title="My Account"
        data={[
          {
            title: "Account Address",
            content: !address
              ? "No account selected"
              : addressShortener(address),
          },
          {
            title: "Azero Balance",
            content: `${balance?.azero || 0} AZERO`,
          },
          { title: "INW Balance", content: `${balance?.inw || 0} INW` },
          {
            title: !tokenInfo?.title ? "" : `${tokenInfo?.title} Balance`,
            content: `${tokenInfo?.content} ${tokenInfo?.title}`,
          },
        ]}
      />

      <IWCard
        w="full"
        variant="outline"
        title={`Transfer ${tokenInfo?.title} Tokens`}
      >
        <IWCard mt="16px" w="full" variant="solid">
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              value={transferAddress}
              onChange={({ target }) => setTransferAddress(target.value)}
              placeholder="Address to transfer"
            />

            <IWInput
              value={transferAmount}
              onChange={({ target }) => setTransferAmount(target.value)}
              type="number"
              placeholder="Amount to transfer"
              inputRightElementIcon={
                <Heading as="h5" size="h5" fontWeight="semibold">
                  {tokenInfo?.title}
                </Heading>
              }
            />

            <Button onClick={() => transferTokenHandler()} w="full">
              Transfer
            </Button>
          </Stack>
        </IWCard>
      </IWCard>
    </Stack>
  );
};

const TokensTabBurnToken = ({
  mode,
  address,
  balance,
  tokenInfo,
  selectedContractAddr,
  loadTokenInfo,
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [burnAmount, setBurnAmount] = useState("");

  async function burnTokenHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }

    if (burnAmount === 0 || !burnAmount) {
      toast.error("Please enter amount to transfer!");
      return;
    }

    if (burnAmount > formatChainStringToNumber(tokenInfo?.content)) {
      toast.error(
        `You don't have enough ${tokenInfo?.title} tokens to transfer!`
      );
      return;
    }

    if (balance?.azero < 0.05) {
      toast.error("Low Azero balance!");
      return;
    }
    await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0, //-> value
      "psp22Burnable::burn",
      currentAccount?.address,
      formatNumToBN(burnAmount)
    );

    await delay(2000).then(() => {
      setBurnAmount(0);
      loadTokenInfo();
    });
  }

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <IWCardOneColumn
        title="My Account"
        data={[
          {
            title: "Account Address",
            content: !address
              ? "No account selected"
              : addressShortener(address),
          },
          {
            title: "Azero Balance",
            content: `${balance?.azero || 0} AZERO`,
          },
          { title: "INW Balance", content: `${balance?.inw || 0} INW` },
          {
            title: !tokenInfo?.title ? "" : `${tokenInfo?.title} Balance`,
            content: `${tokenInfo?.content} ${tokenInfo?.title}`,
          },
        ]}
      />

      <IWCard
        w="full"
        variant="outline"
        title={`Burn ${tokenInfo?.title} Tokens`}
      >
        <IWCard mt="16px" w="full" variant="solid">
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              type="number"
              value={burnAmount}
              onChange={({ target }) => setBurnAmount(target.value)}
              placeholder="Amount to burn"
              inputRightElementIcon={
                <Heading as="h5" size="h5" fontWeight="semibold">
                  {tokenInfo?.title}
                </Heading>
              }
            />

            <Button onClick={burnTokenHandler} w="full">
              Burn
            </Button>
          </Stack>
        </IWCard>
      </IWCard>
    </Stack>
  );
};
