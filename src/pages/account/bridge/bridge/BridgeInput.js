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
import { useAppContext } from "contexts/AppContext";
import { Field } from "formik";
import { useSelector } from "react-redux";
import { formatNumDynDecimal, formatNumToBN } from "utils";
import azero_manager_bridge from "utils/contracts/azero_manager_bridge";
import { getSwapGasLimit } from "utils/contracts/dryRun";
import psp22_contract from "utils/contracts/psp22_contract";

export function BridgeInput(props) {
  const { api } = useAppContext();
  const { currentAccount } = useSelector((state) => state.wallet);

  return (
    <Field name={props.name}>
      {({ field, form, meta }) => (
        <FormControl id={field.name} alignItems="center">
          <FormLabel display="flex" alignItems="center" htmlFor={field.name}>
            <VStack alignItems="start" w="full">
              {props.name === "fromAmount" && (
                <>
                  <Text>From:</Text>
                  <Text>{props.address}</Text>
                  {/* <Text>{`From: ${addressShortener(props.address, 18)}`}</Text> */}
                </>
              )}

              {props.name === "toAmount" && (
                <>
                  <Flex w="full" alignItems="center">
                    <Text>To:</Text>
                    <Spacer />
                    <Switch
                      isDisabled={!currentAccount.address}
                      id="witch-is-send-other"
                      size="sm"
                      colorScheme="blue"
                      isChecked={props.isSendOtherAddress}
                      onChange={() => {
                        props.setIsSendOtherAddress(!props.isSendOtherAddress);
                        if (!props.isSendOtherAddress) {
                          form.setFieldValue(
                            "toAddress",
                            currentAccount.address
                          );
                        } else {
                          form.setFieldValue("toAddress", "");
                        }
                      }}
                    />
                    <Text ml="6px">Other address</Text>
                  </Flex>

                  {props.isSendOtherAddress ? (
                    <Input
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
                    <Text>{props.address}</Text>
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
                      form.setFieldValue("fromAmount", props.tokenBalance);
                      const toAmount =
                        (parseFloat(props.tokenBalance) / 100) * (100 - 5);

                      form.setFieldValue("toAmount", toAmount.toFixed(2));
                    }}
                  >
                    <Text>
                      {`MAX ~ ${formatNumDynDecimal(props.tokenBalance || 0)} ${
                        props.selectedChain?.inwName
                      }`}
                    </Text>
                  </Button>
                )}

                {props.name === "toAmount" && (
                  <Text fontSize="sm">
                    {`Balance: ${formatNumDynDecimal(
                      props.tokenBalance || 0
                    )} ${props.selectedChain?.inwName}`}
                  </Text>
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
              isDisabled={form.isSubmitting || props.name === "toAmount"}
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

                  if (!target.value || parseInt(!target.value) === 0) {
                    form.setFieldValue("gasApprove", 0);
                    form.setFieldValue("gasExec", 0);
                  } else {
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
                        [
                          azero_manager_bridge.CONTRACT_ADDRESS,
                          formatNumToBN(target.value),
                        ]
                      );

                      form.setFieldValue(
                        "gasApprove",
                        gasApproveResult.toFixed(8)
                      );
                    };

                    api && fetchDataGasApproveBridge();

                    const fetchDataGasExecBridge = async () => {
                      const contract = new ContractPromise(
                        api,
                        azero_manager_bridge.CONTRACT_ABI,
                        azero_manager_bridge.CONTRACT_ADDRESS
                      );

                      const gasExecResult = await getSwapGasLimit(
                        api,
                        currentAccount?.address,
                        "createNewTransaction",
                        contract,
                        { value: 0 },
                        [formatNumToBN(target.value), currentAccount?.address]
                      );

                      form.setFieldValue("gasExec", gasExecResult.toFixed(8));
                    };

                    api && fetchDataGasExecBridge();
                  }
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
