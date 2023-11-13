import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { Field } from "formik";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export default function NumberInputWrapper({
  max,
  name,
  label,
  inputWidth,
  isDisabled,
  step = 0.5,
  min = 0.5,
  precision = 2,
  height = "50px",
  isDisplay = true,
  hasStepper = true,
  isRequired = false,
  ...props
}) {
  return (
    <Box style={{ display: isDisplay ? "block" : "none" }} w="full">
      <Field name={name}>
        {({ field, form, meta }) => (
          <FormControl id={name} isRequired={isRequired}>
            {label && (
              <FormLabel
                fontSize={["md", "lg", "lg"]}
                ml={[0, 1]}
                htmlFor={name}
              >
                <Text>{label}</Text>
              </FormLabel>
            )}

            <NumberInput
              {...field}
              min={min}
              id={name}
              max={max}
              step={step}
              w={inputWidth}
              precision={precision}
              isDisabled={isDisabled}
              onChange={(val) => form.setFieldValue(field.name, val)}
            >
              <NumberInputField
                fontSize={["md", "lg"]}
                borderWidth="1px"
                borderRadius={8}
                h={height}
              />

              {hasStepper && (
                <NumberInputStepper>
                  <NumberIncrementStepper
                    border="none"
                    children={<ChevronUpIcon w={5} h={5} />}
                  />
                  <NumberDecrementStepper
                    border="none"
                    children={<ChevronDownIcon w={5} h={5} />}
                  />
                </NumberInputStepper>
              )}
            </NumberInput>

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
    </Box>
  );
}
