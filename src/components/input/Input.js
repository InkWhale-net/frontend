import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

function IWInput(props) {
  const {
    id,
    label,
    extra,
    placeholder,
    type,
    mb,
    variant,
    inputRightElementIcon,
    ...rest
  } = props;

  // const styles = useStyleConfig("Input", { variant });

  return (
    <FormControl>
      {label && (
        <FormLabel>
          <Heading as="h4" size="h4" mb="12px">
            {label}
          </Heading>
        </FormLabel>
      )}
      <InputGroup>
        {inputRightElementIcon && (
          <InputRightElement
            right="16px"
            justifyContent="end"
            pointerEvents="none"
            children={inputRightElementIcon}
          />
        )}
        <Input {...rest} type={type} id={id} placeholder={placeholder} />{" "}
      </InputGroup>
    </FormControl>
  );
}

export default IWInput;
