import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";
import React, { useState, useEffect, useMemo } from "react";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getPublicCurrentAccount } from "utils";
import { formatQueryResultToNumber } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";

import azt_contract from "utils/contracts/azt_contract";
import private_sale_contract from "utils/contracts/private_sale";
import public_sale_contract from "utils/contracts/public_sale";

export default function SaleInfoTab() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const publicCurrentAccount = getPublicCurrentAccount();
  const [balancesContract, setBalancesContract] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [startTimePrivate, setStartTimePrivate] = useState(new Date());
  const [saleInfo, setSaleInfo] = useState({});
  const [pricePrivate, setPricePrivate] = useState("");
  const [pricePublic, setPricePublic] = useState("");
  const [isOwner, setIsOwner] = useState("");

  const getBalanceINWOfAddress = (address) => {
    return execContractQuery(
      publicCurrentAccount?.address,
      "api",
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      address
    );
  };

  const getBalanceSale = async () => {
    let balanceQrs = await Promise.all([
      getBalanceINWOfAddress(public_sale_contract.CONTRACT_ADDRESS),
      getBalanceINWOfAddress(private_sale_contract.CONTRACT_ADDRESS),
    ]);
    setBalancesContract(balanceQrs.map((el) => formatQueryResultToNumber(el)));
  };

  const changeEndDatePublic = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      public_sale_contract.CONTRACT_ABI,
      public_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "genericTokenSaleTrait::setEndTime",
      startTime.getTime()
    );
  };

  const burnAfterSalePublic = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      public_sale_contract.CONTRACT_ABI,
      public_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "genericTokenSaleTrait::setEndTime",
      startTime.getTime()
    );
  };

  const burnAfterSalePrivate = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      private_sale_contract.CONTRACT_ABI,
      private_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "genericTokenSaleTrait::setEndTime",
      startTime.getTime()
    );
  };

  const changeEndDatePrivate = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      private_sale_contract.CONTRACT_ABI,
      private_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "genericTokenSaleTrait::setEndTime",
      startTime.getTime()
    );
  };

  const getEndDate = async () => {
    let query1 = execContractQuery(
      publicCurrentAccount?.address,
      "api",
      private_sale_contract.CONTRACT_ABI,
      private_sale_contract.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::endTime"
    );

    let query2 = execContractQuery(
      publicCurrentAccount?.address,
      "api",
      public_sale_contract.CONTRACT_ABI,
      public_sale_contract.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::endTime"
    );
    let query3 = execContractQuery(
      currentAccount?.address,
      "api",
      public_sale_contract.CONTRACT_ABI,
      public_sale_contract.CONTRACT_ADDRESS,
      0,
      "adminTrait::getBalance"
    );
    let query4 = execContractQuery(
      currentAccount?.address,
      "api",
      private_sale_contract.CONTRACT_ABI,
      private_sale_contract.CONTRACT_ADDRESS,
      0,
      "adminTrait::getBalance"
    );
    let query5 = execContractQuery(
      currentAccount?.address,
      "api",
      private_sale_contract.CONTRACT_ABI,
      private_sale_contract.CONTRACT_ADDRESS,
      0,
      "ownable::owner"
    );
    const [result, result2, result3, result4, result5] = await Promise.all([
      query1,
      query2,
      query3,
      query4,
      query5,
    ]);
    console.log(result, result2, result3, result4);
    setIsOwner(result5.toHuman()?.Ok === currentAccount?.address);
    setSaleInfo({
      endTimePrivate: result?.toHuman()?.Ok?.replaceAll(",", ""),
      endTimePublic: result2?.toHuman()?.Ok?.replaceAll(",", ""),
      withdrawablePublic:
        +result3?.toHuman()?.Ok?.Ok?.replaceAll(",", "") / 10 ** 12,
      withdrawablePrivate:
        +result4?.toHuman()?.Ok?.Ok?.replaceAll(",", "") / 10 ** 12,
      ownerContract: result5.toHuman()?.Ok,
    });
  };

  const changePricePrivate = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      private_sale_contract.CONTRACT_ABI,
      private_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "genericTokenSaleTrait::setInwPrice",
      pricePrivate
    );
  };

  const changePricePublic = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      public_sale_contract.CONTRACT_ABI,
      public_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "genericTokenSaleTrait::setInwPrice",
      pricePublic
    );
  };

  const withdrawPrivate = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      private_sale_contract.CONTRACT_ABI,
      private_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "adminTrait::withdrawFee",
      pricePrivate
    );
  };

  const withdrawPublic = async () => {
    toast.success(`Process...`);
    await execContractTx(
      currentAccount,
      "api",
      public_sale_contract.CONTRACT_ABI,
      public_sale_contract.CONTRACT_ADDRESS,
      0, //-> value
      "adminTrait::withdrawFee",
      pricePrivate
    );
  };

  useEffect(() => {
    if (currentAccount?.address) getBalanceSale();
    getEndDate();
  }, [currentAccount]);

  const styles = useStyleConfig("IWCard", { variant: "outline" });
  return (
    <>
      <Heading as="h4" size="h4" mb="5" fontWeight="600" lineHeight="25px">
        You are {isOwner ? "" : "Not"} owner
      </Heading>
      <Box __css={styles}>
        Public Sale: {balancesContract?.[0]} INW
        <br />
        Public Sale with Vesting: {balancesContract?.[1]} INW
      </Box>
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        mt="40px"
        direction={{ base: "column", lg: "row" }}
      >
        <IWCard
          w="full"
          variant="outline"
          title={`Withdraw  Sale with Vesting`}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              {!!saleInfo?.withdrawablePrivate && (
                <Text>{saleInfo?.withdrawablePrivate} AZERO</Text>
              )}
              <Button isDisabled={!isOwner} onClick={withdrawPrivate} w="full">
                Withdraw All
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
        <IWCard
          w="full"
          variant="outline"
          title={`Withdraw  Sale without Vesting`}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              {!!saleInfo?.withdrawablePublic && (
                <Text>{saleInfo?.withdrawablePublic} AZERO</Text>
              )}
              <Button isDisabled={!isOwner} onClick={withdrawPublic} w="full">
                Withdraw All
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
      </Stack>
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        mt="40px"
        direction={{ base: "column", lg: "row" }}
      >
        <IWCard
          w="full"
          variant="outline"
          title={`Change End Date Sale without Vesting`}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <DateTimePicker
                locale="en-EN"
                value={startTime}
                onChange={setStartTime}
              />
              <Button
                isDisabled={!isOwner}
                onClick={changeEndDatePublic}
                w="full"
              >
                Change End Date
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
        <IWCard
          w="full"
          variant="outline"
          title={`Change End Date Sale with Vesting`}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <DateTimePicker
                locale="en-EN"
                value={startTimePrivate}
                onChange={setStartTimePrivate}
              />
              <Button
                isDisabled={!isOwner}
                onClick={changeEndDatePrivate}
                w="full"
              >
                Change End Date
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
      </Stack>
      <Stack
        w="full"
        spacing="30px"
        mt="40px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        <IWCard w="full" variant="outline" title={`Burn Sale with Vesting`}>
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <Button
                isDisabled={!isOwner}
                isDisabled={Date.now() < saleInfo?.endTimePrivate}
                onClick={burnAfterSalePrivate}
                w="full"
              >
                Burn
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
        <IWCard w="full" variant="outline" title={`Burn Sale without Vesting`}>
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <Button
                isDisabled={!isOwner}
                isDisabled={Date.now() < saleInfo?.endTimePublic}
                onClick={burnAfterSalePublic}
                w="full"
              >
                Burn
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
      </Stack>
      <Stack
        w="full"
        spacing="30px"
        mt="40px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        <IWCard
          w="full"
          variant="outline"
          title={`Change Price Sale With Vesting`}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <IWInput
                value={pricePrivate}
                onChange={(e) => setPricePrivate(e?.target.value)}
                type="number"
                placeholder="Enter INW price"
              />
              <Button
                isDisabled={!isOwner}
                isDisabled={Date.now() >= saleInfo?.endTimePrivate}
                onClick={changePricePrivate}
                w="full"
              >
                Change
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
        <IWCard
          w="full"
          variant="outline"
          title={`Change Price Without Vesting`}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <IWInput
                value={pricePublic}
                onChange={(e) => setPricePublic(e?.target.value)}
                type="number"
                placeholder="Enter INW price"
              />
              <Button
                isDisabled={!isOwner}
                isDisabled={Date.now() >= saleInfo?.endTimePublic}
                onClick={changePricePublic}
                w="full"
              >
                Change
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
      </Stack>
    </>
  );
}
