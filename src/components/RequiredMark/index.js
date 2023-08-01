import { Text } from "@chakra-ui/react";

const RequiredMark = ({ isRequired, ...rest }) =>
  isRequired ? (
    <Text as="span" color="#ff8c8c" {...rest}>
      *
    </Text>
  ) : null;

export default RequiredMark;
