import { Box, Collapse, Divider, Heading, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { BsChevronDown, BsChevronUp, BsFillTrashFill } from "react-icons/bs";

const FlatContainer = ({ title, children }) => {
  const [isCollapsed, setIsCollaped] = useState(false);
  return (
    <Box
      bg={{ base: "#F6F6FC" }}
      borderRadius={{ base: "10px" }}
      padding={{ base: "30px" }}
      mt={"16px"}
    >
      <Box display={{ base: "flex" }} alignItems={{ base: "center" }}>
        <Heading
          as="h3"
          size="h3"
          mb="16px"
          lineHeight={{ base: "1.25", lg: "30px" }}
          sx={{ flex: 1 }}
        >
          {title}
        </Heading>
        <IconButton
          aria-label="remove milestone"
          variant="link"
          sx={{ w: "24px", h: "24px" }}
          icon={<BsFillTrashFill size={"16px"} color="#57527E" />}
          onClick={() => {}}
        />
        <IconButton
          aria-label="remove milestone"
          variant="link"
          sx={{ w: "24px", h: "24px" }}
          icon={
            isCollapsed ? (
              <BsChevronUp size={"16px"} color="#57527E" />
            ) : (
              <BsChevronDown size={"16px"} color="#57527E" />
            )
          }
          onClick={() => setIsCollaped(!isCollapsed)}
        />
      </Box>
      <Divider />
      <Collapse in={isCollapsed} animateOpacity>
        {children}
      </Collapse>
    </Box>
  );
};

export default FlatContainer;
