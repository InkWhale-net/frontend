import { Button, Heading, Link, Select, Stack, Text } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import SectionContainer from "components/container/SectionContainer";
import { AzeroLogo } from "components/icons/Icons";
import IWInput from "components/input/Input";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import psp22Contract from "utils/contracts/psp22_contract";
import azt_contract from "utils/contracts/azt_contract";

import { formatQueryResultToNumber } from "utils";
import { execContractQuery } from "utils/contracts";
import { addressShortener } from "utils";
import { APICall } from "api/client";
import { isAddressValid } from "utils";
import { toastMessages } from "constants";
import { toast } from "react-hot-toast";
import { delay } from "utils";
import { execContractTx } from "utils/contracts";
import { formatNumToBN } from "utils";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { formatNumDynDecimal } from "utils";

const inwContractAddress = azt_contract.CONTRACT_ADDRESS;

export default function FaucetPage({ api }) {
  const { currentAccount } = useSelector((s) => s.wallet);

  const dispatch = useDispatch();

  const inwBalance = currentAccount?.balance?.inw ?? 0;
  const azeroBalance = currentAccount?.balance?.azero ?? 0;
  const [selectedContractAddress, setSelectedContractAddress] = useState(null);

  const [faucetTokensList, setFaucetTokensList] = useState([]);

  // TODO: double checking booking data is correct
  // eslint-disable-next-line no-unused-vars
  const [walMaxCap, setWalMaxCap] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [walMintingCap, setWalMintingCap] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [walTotalMinted, setWalTotalMinted] = useState(0);

  const [inwTotalSupply, setInwTotalSupply] = useState(0);
  const [availableMint, setAvailableMint] = useState(0);
  const [inwBuyAmount, setInwBuyAmount] = useState('');

  useEffect(() => {
    const getFaucetTokensListData = async () => {
      let { ret, status, message } = await APICall.getFaucetTokensList();

      if (status === "OK") {
        setFaucetTokensList(ret);
        return;
      }

      toast.error(`Get faucet tokens list failed. ${message}`);
    };
    getFaucetTokensListData();
  }, [api, currentAccount, currentAccount?.address]);

  const [accountInfo, setAccountInfo] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [accountInfoLoading, setAccountInfoLoading] = useState(false);

  const prepareAccountInfoData = useCallback(() => {
    setAccountInfoLoading(true);

    const fetch = async () => {
      let ret = [
        {
          title: "Account Address",
          content: !currentAccount?.address
            ? "No account selected"
            : addressShortener(currentAccount?.address),
        },
        { title: "Azero Balance", content: `${azeroBalance} AZERO` },
        { title: "INW Balance", content: `${inwBalance} INW` },
      ];

      try {
        if (selectedContractAddress) {
          let balance = await execContractQuery(
            currentAccount?.address,
            api,
            psp22Contract.CONTRACT_ABI,
            selectedContractAddress,
            0,
            "psp22::balanceOf",
            currentAccount?.address
          );

          const symbol = faucetTokensList.find(
            (item) => item.contractAddress === selectedContractAddress
          )?.symbol;

          ret.push({
            title: `${symbol} Balance`,
            content: `${formatQueryResultToNumber(balance)} ${symbol}`,
          });
        }
        setAccountInfoLoading(false);
        setAccountInfo((prev) => {
          return ret;
        });
      } catch (error) {
        setAccountInfoLoading(false);
        toast.error(error.message);
        console.log("error", error);
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    api,
    azeroBalance,
    currentAccount?.address,
    faucetTokensList,
    selectedContractAddress,
    inwBalance,
    inwTotalSupply,
  ]);

  useEffect(() => {
    prepareAccountInfoData();
  }, [prepareAccountInfoData]);

  const faucetHandler = async (selectedContractAddress) => {
    if (!api) {
      toast.error(toastMessages.ERR_API_CONN);
      return;
    }

    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (!selectedContractAddress) {
      toast.error(toastMessages.NO_TOKEN_SELECTED);
      return;
    }

    if (!isAddressValid(selectedContractAddress)) {
      toast.error(toastMessages.INVALID_ADDRESS);
      return;
    }

    await execContractTx(
      currentAccount,
      api,
      psp22Contract.CONTRACT_ABI,
      selectedContractAddress,
      0, //-> value
      "faucet"
    );

    await delay(2000).then(() => {
      prepareAccountInfoData();
    });
  };

  const getInwMintingCapAndTotalSupply = useCallback(async () => {
    if (!api) {
      setInwTotalSupply(0);
      setWalMintingCap(0);
      return;
    }

    let result = await execContractQuery(
      process.env.REACT_APP_PUBLIC_ADDRESS,
      api,
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0,
      "tokenMintCapTrait::mintingCap"
    );
    const walMintingCap = formatQueryResultToNumber(result);

    setWalMintingCap(walMintingCap);

    let result1 = await execContractQuery(
      process.env.REACT_APP_PUBLIC_ADDRESS,
      api,
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0,
      "psp22::totalSupply"
    );
    const inwTotalSupply = formatQueryResultToNumber(result1);

    setInwTotalSupply(inwTotalSupply);

    const availableMint = ((result - result1) / 10 ** 12).toFixed(4);

    setAvailableMint(availableMint);
  }, [api]);

  const [inwMintingFee, setInwMintingFee] = useState(0);

  useEffect(() => {
    const getInwMaxCap = async () => {
      if (!currentAccount) return setWalMaxCap(0);

      let result = await execContractQuery(
        currentAccount?.address,
        api,
        azt_contract.CONTRACT_ABI,
        azt_contract.CONTRACT_ADDRESS,
        0,
        "tokenMintCapTrait::cap"
      );
      const walMaxCap = formatQueryResultToNumber(result);

      setWalMaxCap(walMaxCap);
    };
    getInwMaxCap();

    getInwMintingCapAndTotalSupply();

    const getInwTotalMinted = async () => {
      if (!currentAccount) return setWalTotalMinted(0);

      let result = await execContractQuery(
        currentAccount?.address,
        api,
        azt_contract.CONTRACT_ABI,
        azt_contract.CONTRACT_ADDRESS,
        0,
        "tokenMintCapTrait::totalMinted"
      );
      const walTotalMinted = formatQueryResultToNumber(result);

      setWalTotalMinted(walTotalMinted);
    };
    getInwTotalMinted();

    const getInwMintingFee = async () => {
      if (!api) return setInwMintingFee(1);

      let result = await execContractQuery(
        process.env.REACT_APP_PUBLIC_ADDRESS,
        api,
        azt_contract.CONTRACT_ABI,
        azt_contract.CONTRACT_ADDRESS,
        0,
        "tokenMintCapTrait::mintingFee"
      );
      const mintingFee = formatQueryResultToNumber(result);

      setInwMintingFee(mintingFee);
    };
    getInwMintingFee();
  }, [api, currentAccount, getInwMintingCapAndTotalSupply]);

  const inwPublicMintHandler = async () => {
    if (!api) {
      toast.error(toastMessages.ERR_API_CONN);
      return;
    }

    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    await execContractTx(
      currentAccount,
      api,
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      formatNumToBN(parseFloat(inwMintingFee) * inwBuyAmount), //-> value
      "tokenMintCapTrait::publicMint",
      formatNumToBN(inwBuyAmount) // -> token_amount, <...args>
    );

    await delay(2000).then(() => {
      getInwMintingCapAndTotalSupply();

      setInwBuyAmount(0);
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
  };

  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Faucet"
        description={
          <span>
            Get some test tokens into your account. To get some TZERO, please
            visit{" "}
            <Link
              isExternal
              color="text.1"
              href="https://faucet-smartnet.test.azero.dev"
            >
              https://faucet-smartnet.test.azero.dev
            </Link>
          </span>
        }
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column", lg: "row" }}
        >
          <IWCardOneColumn title="My Account" data={accountInfo} />

          <IWCard w="full" variant="outline" title="Get Test Tokens">
            <IWCard mt="16px" w="full" variant="solid">
              <Stack
                w="100%"
                spacing="20px"
                direction={{ base: "column", xl: "row" }}
                align={{ base: "column", xl: "center" }}
              >
                {/* {
                  "_id": "63b44de4e1fde59c4e809c81",
                  "name": "Azero Monkey",
                  "symbol": "AZM",
                  "decimal": 12,
                  "contractAddress": "5E2NYJjLDU4wMnU9EUs6ujTqZkGLEZicQAeyYRq9EDgvPbsh",
                  "creator": "5CHujJTu8KgKZ76yKYuYgdMbz7jj4XuALZZYf4mNnuFjCcvw",
                  "mintTo": "5CHujJTu8KgKZ76yKYuYgdMbz7jj4XuALZZYf4mNnuFjCcvw",
                  "totalSupply": 500000,
                  "index": 49,
                  "__v": 0
                 } */}

                <Select
                  // isDisabled={accountInfoLoading}
                  id="token"
                  placeholder="Select token"
                  onChange={({ target }) =>
                    setSelectedContractAddress(target.value)
                  }
                >
                  {faucetTokensList?.map((token, idx) => (
                    <option key={idx} value={token.contractAddress}>
                      {token?.symbol} ({token?.name}) -{" "}
                      {addressShortener(token?.contractAddress)}
                    </option>
                  ))}
                </Select>

                <Button
                  // isDisabled={accountInfoLoading}
                  minW="130px"
                  onClick={() => faucetHandler(selectedContractAddress)}
                >
                  Send me
                </Button>
              </Stack>
            </IWCard>
          </IWCard>
        </Stack>{" "}
      </SectionContainer>

      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="INW Tokens"
        description={
          <>
            INW tokens are used as transaction fee. 100M INW tokens are
            available at {inwMintingFee}
            <AzeroLogo w="14px" h="14px" ml="2px" mb="3px" /> per INW. You can
            trade INW on PanoramaSwap in due time.
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
            title="Information"
            data={[
              { title: "Total Name", content: "Ink Whale Token" },
              {
                title: "Contract Address",
                content: addressShortener(inwContractAddress),
              },
              { title: "Total Supply", content: inwTotalSupply },
              { title: "Token Symbol", content: "INW" },
            ]}
          />

          <IWCard w="full" variant="outline" title="Acquire INW Tokens">
            <IWCard mt="16px" w="full" variant="solid">
              <Stack
                w="100%"
                spacing="20px"
                direction={{ base: "column" }}
                align={{ base: "column", xl: "center" }}
              >
                <IWInput
                  value={inwBuyAmount}
                  onChange={({ target }) => setInwBuyAmount(target.value)}
                  type="number"
                  placeholder="Enter INW amount"
                  inputRightElementIcon={
                    <Heading as="h5" size="h5" fontWeight="semibold">
                      INW
                    </Heading>
                  }
                />

                <IWInput
                  value={inwBuyAmount * parseFloat(inwMintingFee)}
                  isDisabled={true}
                  type="number"
                  placeholder="0.000000000"
                  inputRightElementIcon={<AzeroLogo />}
                />

                <Text textAlign="left" w="full" fontSize="md" lineHeight="28px">
                  (There are {formatNumDynDecimal(availableMint)} INW tokens
                  available to mint){" "}
                </Text>

                <Button w="full" onClick={() => inwPublicMintHandler()}>
                  Get INW
                </Button>
              </Stack>
            </IWCard>
          </IWCard>
        </Stack>
      </SectionContainer>
    </>
  );
}
