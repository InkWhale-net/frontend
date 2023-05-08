import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

var reg = /^-?\d*\.?\d*$/

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
    onChange,
    ...rest
  } = props;

  // const styles = useStyleConfig("Input", { variant });

  const onChangeInput = (valueString) => {
    if (type === "number") {
      if (reg.test(valueString.target.value)) {
        onChange(valueString);
      }
    } else {
      onChange(valueString);
    }
  };

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
        <Input
          {...rest}
          onChange={onChangeInput}
          type={type}
          id={id}
          min={0}
          placeholder={placeholder}
        />{" "}
      </InputGroup>
    </FormControl>
  );
}

export default IWInput;
