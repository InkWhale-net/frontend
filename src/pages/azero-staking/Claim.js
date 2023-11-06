import React, { Fragment } from "react";
import StakingTable from "./components/Table";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import IWCard from "components/card/Card";

function Claim() {
  return (
    <div>
      <IWCard w="full" variant="outline" mb="24px">
        <SimpleGrid columns={[1, 2, 3]} spacing={"24px"}>
          {prepareHeaderInfo()?.map((i) => {
            return (
              <Box key={i.title} minH="80px" px="12px">
                <Text fontWeight={700}>{i.title}</Text>
                {i?.data?.map((d, idx) => (
                  <Text key={idx}>
                    {d.amount} {d.type}
                  </Text>
                ))}
              </Box>
            );
          })}
        </SimpleGrid>
      </IWCard>

      <StakingTable />
    </div>
  );
}

export default Claim;

function prepareHeaderInfo() {
  return [
    {
      title: "Available to claim",
      data: [
        { amount: 999, type: "AZERO" },
        { amount: 121999, type: "INW" },
      ],
    },
    {
      title: "My pending amount",
      data: [
        { amount: 99, type: "AZERO" },
        { amount: 1219, type: "INW" },
      ],
    },
    {
      title: "My requests",
      data: [
        { amount: 5, type: "Finished" },
        { amount: 2, type: "Pending" },
      ],
    },
  ];
}
