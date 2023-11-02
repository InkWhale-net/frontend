import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { useHistory, useLocation } from "react-router-dom";
import { formatDataCellTable } from "./IWPaginationTable";

const getStatusPool = (startTime, duration) => {
  if (startTime + duration * 1000 < new Date()) {
    return "Pool ended!";
  }
  return startTime < new Date() ? "Pool live!" : "Upcoming";
};

const ElementCard = ({ tableHeader, itemObj, mode, onClickItemHandler }) => {
  return (
    <Box
      w={{ base: "full" }}
      minH={{ base: "20px" }}
      mb={{ base: "14px" }}
      borderWidth={{ base: "2px" }}
      borderRadius={{ base: "10px" }}
      padding={{ base: "14px" }}
      _hover={{
        borderColor: "#93F0F5",
        backgroundColor: "#E8FDFF",
      }}
      onClick={() => onClickItemHandler(itemObj)}
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {tableHeader.map(
          (
            { name, label, hasTooltip, tooltipContent, showTooltipIconContent },
            index
          ) => {
            return (
              <React.Fragment key={index}>
                <Flex alignItems="center">
                  {label}
                  {hasTooltip && (
                    <Tooltip fontSize="md" label={tooltipContent}>
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  )}
                </Flex>
                <Box
                  p={{ base: "4px" }}
                  color={{ base: "#57527E" }}
                  fontWeight={{ base: "bold" }}
                  fontSize={["16px", "18px"]}
                >
                  <FadeIn>
                    {formatDataCellTable(
                      itemObj,
                      name,
                      mode,
                      showTooltipIconContent
                    )}
                  </FadeIn>
                </Box>
              </React.Fragment>
            );
          }
        )}
      </Grid>
    </Box>
  );
};

export function IWMobileList({
  tableHeader,
  tableBody,
  mode,
  loading,
  isDisableRowClick = false,
  customURLRowClick = "",
}) {
  const history = useHistory();
  const location = useLocation();
  const onClickItemHandler = (itemObj) => {
    if (isDisableRowClick) return;

    if (customURLRowClick) {
      history.push({
        state: { ...itemObj, mode },
        pathname: `${customURLRowClick}/${itemObj?.poolContract}`,
      });

      return;
    }

    history.push({
      state: { ...itemObj, mode },
      pathname: `${location.pathname}/${itemObj?.poolContract}`,
    });
  };
  return (
    <Box w={{ base: "full" }}>
      {loading ? null : tableBody?.length === 0 ? (
        <Text textAlign="center" w="full">
          No data found!
        </Text>
      ) : (
        tableBody?.map((itemObj, idx) => {
          return (
            <ElementCard
              tableHeader={tableHeader}
              itemObj={itemObj}
              mode={mode}
              onClickItemHandler={onClickItemHandler}
            />
          );
        })
      )}
    </Box>
  );
}
