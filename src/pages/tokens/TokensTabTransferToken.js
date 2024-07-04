import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import IWInput from "components/input/Input";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { addressShortener } from "utils";
import { handleCopy } from "utils";
import { resolveAZDomainToAddress } from "utils";
import {
  delay,
  formatChainStringToNumber,
  formatNumToBN,
  isAddressValid,
} from "utils";
import { execContractTx } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import MyAccountTab from "./myAccount";
import { appChain } from "constants";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ContractPromise } from "@polkadot/api-contract";
import { getEstimatedGasBatchTx } from "utils";
import { useAppContext } from "contexts/AppContext";
import { batchTxResponseErrorHandler } from "utils";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

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
  const { api } = useAppContext();
  const dispatch = useDispatch();

  const [transferAddress, setTransferAddress] = useState("");
  const [addressFromDomain, setAddressFromDomain] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferList, setTransferList] = useState([
    {
      address: "",
      amount: "",
    },
  ]);
  const validationSchema = Yup.array().of(
    Yup.object().shape({
      address: Yup.string()
        .trim()
        // .min(2, "Must be at least 2 characters")
        // .max(40, "Must be at most 100 characters")
        .required("This field is required"),
      amount: Yup.string()
        .trim()
        // .min(2, "Must be at least 2 characters")
        // .max(100, "Must be at most 100 characters")
        .required("This field is required"),
    })
  );
  const addNewTranferE = () => {
    setTransferList([
      ...transferList,
      {
        address: "",
        amount: "",
      },
    ]);
  };
  const updateAddress = (value, index) => {
    let cloneList = [...transferList];
    cloneList[index].address = value;
    setTransferList(cloneList);
  };
  const updateAmount = (value, index) => {
    let cloneList = [...transferList];
    cloneList[index].amount = value;
    setTransferList(cloneList);
  };
  const removeTransferE = (index) => {
    setTransferList(
      transferList.filter((e) => !(transferList.indexOf(e) == index))
    );
  };
  const bulkTransferTokenHandler = async (transferValue, resetForm) => {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }
    toast.success(transferValue?.length > 0 && `Bulk Transfer process...`);
    let unsubscribe;
    let transferTxALL;

    const address = currentAccount?.address;
    const { signer } = await web3FromSource(currentAccount?.meta?.source);

    toast.success("Estimated transaction fee...");
    const value = 0;
    let gasLimit;

    const tokenContract = new ContractPromise(
      api,
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr
    );

    gasLimit = await getEstimatedGasBatchTx(
      address,
      tokenContract,
      value,
      "psp22::transfer",
      transferValue[0].address,
      formatNumToBN(transferValue[0].amount, tokenInfo?.decimals),
      []
    );
    await Promise.all(
      transferValue.map(async (info) => {
        const ret = tokenContract.tx["psp22::transfer"](
          { gasLimit, value },
          info.address,
          formatNumToBN(info.amount, tokenInfo?.decimals),
          []
        );

        return ret;
      })
    ).then((res) => (transferTxALL = res));
    api.tx.utility
      .batch(transferTxALL)
      .signAndSend(
        address,
        { signer },
        async ({ events, status, dispatchError }) => {
          if (status?.isFinalized) {
            let totalSuccessTxCount = null;

            events.forEach(
              async ({ event, event: { data, method, section, ...rest } }) => {
                if (api.events.utility?.BatchInterrupted.is(event)) {
                  totalSuccessTxCount = data[0]?.toString();
                }

                if (api.events.utility?.BatchCompleted.is(event)) {
                  resetForm();
                  toast.success(
                    transferValue?.length === 1
                      ? "Token has been transfered successfully                  "
                      : "All Token have been transfered successfully"
                  );
                }
              }
            );

            // await listNFTStake.map(
            //   async (info) =>
            //     await APICall.askBEupdateNFTFromArtZero({
            //       collection_address: NFTtokenContract,
            //       token_id: info?.tokenID,
            //     })
            // );
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!totalSuccessTxCount) {
              toast.error(
                transferValue?.length === 1
                  ? "Transfer is not fully successful!                "
                  : `Bulk transfer are not fully successful! ${totalSuccessTxCount} transfer completed successfully.`
              );
            }
            // updateData();
            batchTxResponseErrorHandler({
              status,
              dispatchError,
              dispatch,
              txType: "MULTI_TRANSFER",
              api,
              currentAccount,
              isApprovalTx: true,
            });
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => toast.error("The transfer fail", error?.message));

    return unsubscribe;
  };
  async function transferTokenHandler(values, resetForm) {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }
    const resolvedAddress = await resolveAZDomainToAddress(values.address);
    setAddressFromDomain(resolvedAddress);
    if (!isAddressValid(values.address) && !resolvedAddress) {
      return toast.error("Invalid address!");
    }

    if (values.amount === 0 || !values.amount) {
      toast.error("Please enter amount to transfer!");
      return;
    }
    if (+values.amount > formatChainStringToNumber(tokenInfo?.content)) {
      toast.error(
        `You don't have enough ${tokenInfo?.title} tokens to transfer!`
      );
      return;
    }
    if (balance?.azero < 0.05) {
      toast.error(`Low ${appChain?.unit} balance!`);
      return;
    }

    await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0, //-> value
      "psp22::transfer",
      resolvedAddress ? resolvedAddress : values.address,
      formatNumToBN(values.amount, tokenInfo?.decimals),
      []
    );

    await delay(2000).then(() => {
      setTransferAddress("");
      setTransferAmount("");
      loadTokenInfo();
      dispatch(fetchUserBalance({ currentAccount, api }));
      resetForm();
    });
  }
  const handleSubmit = async (values, { resetForm }) => {
    if (values.length == 1) {
      transferTokenHandler(values[0], resetForm);
    }
    if (values.length > 1) {
      bulkTransferTokenHandler(values, resetForm);
    }
  };
  return (
    <Formik
      initialValues={transferList}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column", lg: "row" }}
        >
          <MyAccountTab
            address={address}
            balance={balance}
            tokenInfo={tokenInfo}
          />

          <IWCard
            w="full"
            variant="outline"
            title={`Transfer ${tokenInfo?.title} Tokens`}
          >
            <IWCard mt="16px" w="full" variant="solid">
              <Field>
                {({ form }) =>
                  form.values?.map((obj, index) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "4px",
                          mt: index > 0 ? "8px" : 0,
                        }}
                      >
                        <FormControl
                          isInvalid={
                            form.errors?.[index]?.address &&
                            form.touched?.[index]?.address
                          }
                        >
                          <IWInput
                            sx={{
                              flex: 1,
                              borderColor:
                                form.errors?.[index]?.address &&
                                form.touched?.[index]?.address
                                  ? "red"
                                  : null,
                            }}
                            value={obj.address}
                            onChange={({ target }) => {
                              const updatedArray = [...form.values];
                              if (index >= 0 && index < updatedArray.length) {
                                updatedArray[index] = {
                                  ...updatedArray[index],
                                  address: target.value,
                                };
                              }
                              form.setValues(updatedArray);
                            }}
                            placeholder={`Address${
                              appChain?.haveAzeroID ? " or azero.id" : ""
                            } to transfer`}
                          />
                        </FormControl>

                        <Box w="200px">
                          <FormControl
                            isInvalid={
                              form.errors?.[index]?.address &&
                              form.touched?.[index]?.address
                            }
                          >
                            <IWInput
                              value={obj.amount}
                              type="number"
                              sx={{
                                borderColor:
                                  form.errors?.[index]?.amount &&
                                  form.touched?.[index]?.amount
                                    ? "red"
                                    : null,
                              }}
                              onChange={({ target }) => {
                                const updatedArray = [...form.values];
                                if (index >= 0 && index < updatedArray.length) {
                                  updatedArray[index] = {
                                    ...updatedArray[index],
                                    amount: target.value,
                                  };
                                }
                                form.setValues(updatedArray);
                              }}
                              placeholder={`Amount`}
                            />
                          </FormControl>
                        </Box>
                        {index <= form.values?.length - 2 ? (
                          <Box
                            sx={{
                              w: "52px",
                              h: "52px",
                              bg: "#93F0F5",
                              borderRadius: "6px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              form.setValues([
                                ...form.values.slice(0, index),
                                ...form.values.slice(index + 1),
                              ]);
                            }}
                          >
                            <AiOutlineMinus color="white" />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              w: "52px",
                              h: "52px",
                              bg: "#93F0F5",
                              borderRadius: "6px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (form.values?.length < 10) {
                                form.setValues([
                                  ...form.values,
                                  {
                                    address: "",
                                    amount: "",
                                  },
                                ]);
                              } else {
                                toast("Max bulk transfer address is 10")
                              }
                            }}
                          >
                            <AiOutlinePlus color="white" />
                          </Box>
                        )}
                      </Box>
                    );
                  })
                }
              </Field>
              {/* {transferList?.map((obj, index) => (
                <Box
                  sx={{
                    display: "flex",
                    gap: "4px",
                    mt: index > 0 ? "8px" : 0,
                  }}
                >
                  <FormControl
                    isInvalid={
                      form.errors?.phase?.[index]?.name &&
                      form.touched?.phase?.[index]?.name
                    }
                  >
                    <IWInput
                      sx={{
                        flex: 1,
                      }}
                      value={transferList[index].address}
                      onChange={({ target }) => {
                        updateAddress(target.value, index);
                        // setTransferAddress(target.value);
                        // setAddressFromDomain("");
                        // setTransferAmount("");
                      }}
                      placeholder={`Address${
                        appChain?.haveAzeroID ? " or azero.id" : ""
                      } to transfer`}
                    />
                  </FormControl>
                  <Box w="200px">
                    <IWInput
                      value={transferList[index].amount}
                      type="number"
                      onChange={({ target }) => {
                        updateAmount(target.value, index);
                        // setTransferAddress(target.value);
                        // setAddressFromDomain("");
                        // setTransferAmount("");
                      }}
                      placeholder={`Amount`}
                    />
                  </Box>
                  {index <= transferList?.length - 2 ? (
                    <Box
                      sx={{
                        w: "52px",
                        h: "52px",
                        bg: "#93F0F5",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => removeTransferE(index)}
                    >
                      <AiOutlineMinus color="white" />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        w: "52px",
                        h: "52px",
                        bg: "#93F0F5",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => addNewTranferE()}
                    >
                      <AiOutlinePlus color="white" />
                    </Box>
                  )}
                </Box>
              ))}
              {addressFromDomain && transferAddress && (
                <IWInput
                  value={addressShortener(addressFromDomain)}
                  readOnly
                  inputRightElementIcon={
                    <Box
                      sx={{
                        cursor: "pointer",
                      }}
                      ml="4px"
                      mb="8px"
                      w="20px"
                      h="21px"
                      color="#8C86A5"
                      onClick={() => handleCopy("Address", address)}
                    >
                      <CopyIcon w="20px" h="21px" />
                    </Box>
                  }
                />
              )} */}
              {/* <IWInput
            value={transferAmount}
            onChange={({ target }) => setTransferAmount(target.value)}
            type="number"
            placeholder="Amount to transfer"
            inputRightElementIcon={
              <Heading as="h5" size="h5" fontWeight="semibold">
                {tokenInfo?.title}
              </Heading>
            }
          /> */}

              <Button
                // isDisabled={!Number(transferAmount) || !transferAddress}
                type="submit"
                w="full"
                mt="8px"
              >
                Transfer
              </Button>
            </IWCard>
          </IWCard>
        </Stack>
      </Form>
    </Formik>
  );
};

export default TokensTabTransferToken;
