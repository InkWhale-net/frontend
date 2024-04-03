import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ContractPromise } from "@polkadot/api-contract";
import AddressCopier from "components/address-copier/AddressCopier";
import { useAppContext } from "contexts/AppContext";
import { Field } from "formik";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatNumToBN } from "utils";
import azero_bridge_token_contract from "utils/contracts/azero_bridge_token_contract";
import { getSwapGasLimit } from "utils/contracts/dryRun";
import { fetchDataGasExecBridgeFirechain } from "utils/contracts/firechain";
import { fetchDataGasApproveBridgeFirechain } from "utils/contracts/firechain";
import psp22_contract from "utils/contracts/psp22_contract";

export function BridgeInput(props) {
  const { api } = useAppContext();
  const { currentAccount } = useSelector((state) => state.wallet);

  const balance = currentAccount?.balance?.[props?.selectedChain?.key];

  return (
    <Field name={props.name}>
      {({ field, form, meta }) => (
        <FormControl id={field.name} alignItems="center">
          <FormLabel display="flex" alignItems="center" htmlFor={field.name}>
            <VStack alignItems="start" w="full">
              <Text>
                Balance: {balance?.inw2 || 0} {props.selectedChain?.inwName}
              </Text>

              {props.name === "fromAmount" && (
                <Flex>
                  <Text mr="4px">From:</Text>
                  <AddressCopier address={props.address} />
                </Flex>
              )}

              {props.name === "toAmount" && (
                <>
                  <Flex w="full" alignItems={["start", "center", "center"]}>
                    <Text mr="4px">To:</Text>
                    <Spacer />
                    <Flex w="full" alignItems="center">
                      <Text fontWeight={!props.isSendOtherAddress ? 800 : 500}>
                        Connected address
                      </Text>
                      <Switch
                        mx="6px"
                        isDisabled={!currentAccount?.address}
                        id="witch-is-send-other"
                        size="sm"
                        colorScheme="blue"
                        isChecked={props.isSendOtherAddress}
                        onChange={() => {
                          props.setIsSendOtherAddress(
                            !props.isSendOtherAddress
                          );
                          if (!props.isSendOtherAddress) {
                            form.setFieldValue(
                              "toAddress",
                              currentAccount?.address
                            );
                          } else {
                            form.setFieldValue("toAddress", "");
                          }
                        }}
                      />
                      <Text fontWeight={props.isSendOtherAddress ? 800 : 500}>
                        Other
                      </Text>
                    </Flex>
                  </Flex>

                  {props.isSendOtherAddress ? (
                    <Input
                      w="full"
                      fontSize="12px"
                      h="30px"
                      size="sm"
                      type="text"
                      id="toAddress"
                      isDisabled={form.isSubmitting}
                      onChange={({ target }) => {
                        form.setFieldValue("toAddress", target.value);
                      }}
                      value={form.values["toAddress"]}
                      placeholder="0"
                    />
                  ) : (
                    <AddressCopier address={props.address} />
                  )}
                </>
              )}

              <Flex justify="space-between" w="full">
                <Flex align="center">
                  <Image
                    w="16px"
                    h="16px"
                    src={props.selectedChain?.icon}
                    alt={`${props.selectedChain?.key}-logo`}
                  />
                  <Text mx="4px">{props.selectedChain?.name} </Text>
                </Flex>
                <Spacer />

                {props.name === "fromAmount" && (
                  <Button
                    size="xs"
                    minW="fit-content"
                    onClick={() => {
                      form.setFieldValue(
                        "fromAmount",
                        balance?.inw2?.replaceAll(",", "")
                      );
                      const toAmount =
                        (parseFloat(balance?.inw2?.replaceAll(",", "")) / 100) *
                        (100 - 5);

                      form.setFieldValue("toAmount", toAmount.toFixed(2));
                      calculateEstGas(
                        balance?.inw2?.replaceAll(",", ""),
                        form,
                        api,
                        currentAccount
                      );
                    }}
                  >
                    MAX
                  </Button>
                )}
              </Flex>
            </VStack>
          </FormLabel>

          <InputGroup>
            <InputRightElement>
              <Text fontSize="xs">{props.selectedChain?.inwName}</Text>
            </InputRightElement>

            <Input
              {...field}
              pl="24px"
              textAlign="right"
              type="number"
              id={field.name}
              placeholder="0"
              value={form.values[field.name]}
              isDisabled={
                !currentAccount?.address ||
                form.isSubmitting ||
                props.name === "toAmount"
              }
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "-") {
                  e.preventDefault();
                }
              }}
              onChange={({ target }) => {
                form.setFieldValue(field.name, target.value);

                if (field.name === "fromAmount") {
                  const toAmount = (parseFloat(target.value) / 100) * (100 - 5);

                  form.setFieldValue("toAmount", toAmount.toFixed(2));

                  calculateEstGas(target?.value, form, api, currentAccount);
                }
              }}
            />
          </InputGroup>

          <Text
            h="20px"
            color="red"
            textAlign="left"
            fontSize="14px"
            lineHeight="22px"
          >
            {meta.touched && meta.error ? meta.error : null}
          </Text>
        </FormControl>
      )}
    </Field>
  );
}

function calculateEstGas(value, form, api, currentAccount) {
  const fromChain = form?.values?.fromChain;

  try {
    if (!value || parseInt(!value) === 0) {
      form.setFieldValue("gasApprove", 0);
      form.setFieldValue("gasExec", 0);
    } else {
      if (fromChain === "alephzero-testnet") {
        const fetchDataGasApproveBridge = async () => {
          const contract = new ContractPromise(
            api,
            psp22_contract.CONTRACT_ABI,
            psp22_contract.CONTRACT_ADDRESS
          );

          const gasApproveResult = await getSwapGasLimit(
            api,
            currentAccount?.address,
            "psp22::approve",
            contract,
            { value: 0 },
            [azero_bridge_token_contract.CONTRACT_ADDRESS, formatNumToBN(value)]
          );

          form.setFieldValue("gasApprove", gasApproveResult.toFixed(8));
        };

        api && fetchDataGasApproveBridge();

        const fetchDataGasExecBridge = async () => {
          const contract = new ContractPromise(
            api,
            azero_bridge_token_contract.CONTRACT_ABI,
            azero_bridge_token_contract.CONTRACT_ADDRESS
          );

          const gasExecResult = await getSwapGasLimit(
            api,
            currentAccount?.address,
            "createNewTransaction",
            contract,
            { value: 0 },
            [formatNumToBN(value), currentAccount?.address]
          );

          form.setFieldValue("gasExec", gasExecResult.toFixed(8));
        };

        api && fetchDataGasExecBridge();
      }

      if (fromChain === "firechain-testnet") {
        api && fetchDataGasApproveBridgeFirechain(value, form, currentAccount);
        api && fetchDataGasExecBridgeFirechain(value, form, currentAccount);
      }
    }
  } catch (error) {
    toast.error("Error fetching est. gas!");
    console.log("error", error);
  }
}
