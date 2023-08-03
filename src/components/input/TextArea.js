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
    maxLength,
    ...rest
  } = props;

  // const styles = useStyleConfig("Input", { variant });

  const onChangeInput = (valueString) => {
    if (type === "number") {
      if (reg.test(valueString.target.value)) {
        if (maxLength > 0) {
          const slicedValue = valueString.target.value.slice(0, maxLength);
          onChange({
            ...valueString,
            target: { ...valueString.target, value: slicedValue },
          });
        } else onChange(valueString);
      }
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
      <InputGroup>
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
          background="#FFF"
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
