import {
  FormControl,
  FormLabel,
  Heading,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";

var reg = /^\d*\.?\d*$/;

function IWTextArea(props) {
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
      <InputGroup {...rest}>
        {inputRightElementIcon && (
          <InputRightElement
            right="16px"
            justifyContent="end"
            children={inputRightElementIcon}
          />
        )}
        <Textarea
          {...rest}
          onChange={onChangeInput}
          type={type}
          id={id}
          onWheel={(e) => e.target.blur()}
          min={0}
          placeholder={placeholder}
        />
      </InputGroup>
    </FormControl>
  );
}

export default IWTextArea;
