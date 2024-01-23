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
    onChange,
    maxLength,
    ...rest
  } = props;

  // const styles = useStyleConfig("Input", { variant });
  const onChangeInput = (valueString) => {
    if (type === "number") {
      const num = valueString?.target?.value?.replace(/[^0-9]/g, "");
      valueString.target.value = num;
      onChange(valueString);
    } else {
      if (maxLength > 0) {
        const slicedValue = valueString.target.value.slice(0, maxLength);
        onChange({
          ...valueString,
          target: { ...valueString.target, value: slicedValue },
        });
      } else onChange(valueString);
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
      <InputGroup {...rest}>
        {inputRightElementIcon && (
          <InputRightElement
            right="10px"
            justifyContent="end"
            children={inputRightElementIcon}
          />
        )}
        <Input
          {...rest}
          onChange={onChangeInput}
          // type={type}
          id={id}
          onWheel={(e) => e.target.blur()}
          min={0}
          placeholder={placeholder}
        />{" "}
      </InputGroup>
    </FormControl>
  );
}

export default IWInput;
