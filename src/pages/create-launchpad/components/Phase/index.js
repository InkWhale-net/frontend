import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";

const Phase = () => {
  const [phaseForm, setPhaseForm] = useState(null);
  return (
    <>
      <Box w={{ base: "full" }}>
        <Box
          bg={{ base: "#F6F6FC" }}
          borderRadius={{ base: "10px" }}
          padding={{ base: "30px" }}
          sx={{ display: "flex", flexDirection: "column" }}
          mt="16px"
        >
          <Heading
            as="h2"
            size="h2"
            mb="16px"
            lineHeight={{ base: "1.25", lg: "30px" }}
          >
            Add Phase
          </Heading>
          <SimpleGrid columns={3} spacing={4}>
            <SectionContainer title={"Name"}>
              <IWInput
                value={phaseForm?.name}
                onChange={({ target }) =>
                  setPhaseForm({ ...phaseForm, name: target.value })
                }
                placeholder="Name"
              />
            </SectionContainer>
            <SectionContainer title={"Start Date & Time"}>
              <Flex
                h="52px"
                borderWidth="1px"
                justifyContent="start"
                borderRadius="5px"
              >
                <DateTimePicker
                  locale="en-EN"
                  value={phaseForm?.startTime || new Date()}
                  onChange={(value) => console.log(value)}
                />
              </Flex>
            </SectionContainer>
            <SectionContainer title={"End Date & Time"}>
              <Flex
                h="52px"
                borderWidth="1px"
                justifyContent="start"
                borderRadius="5px"
              >
                <DateTimePicker
                  locale="en-EN"
                  value={phaseForm?.endTime || new Date()}
                  onChange={(value) => console.log(value)}
                />
              </Flex>
            </SectionContainer>
            <Box sx={{ display: "flex" }}>
              <Heading
                as="h3"
                size="h3"
                mb="16px"
                lineHeight={{ base: "1.25", lg: "30px" }}
              >
                Allow Public Sale
              </Heading>
              <Switch
                sx={{ mt: "4px", ml: "16px" }}
                id="zero-reward-pools"
                isChecked={phaseForm?.allowPublicSale}
                onChange={() =>
                  setPhaseForm({
                    ...phaseForm,
                    allowPublicSale: !phaseForm?.allowPublicSale,
                  })
                }
              />
            </Box>
          </SimpleGrid>
          <Heading
            as="h2"
            size="h2"
            mb="16px"
            lineHeight={{ base: "1.25", lg: "30px" }}
          >
            Vesting Plan
          </Heading>
          <SimpleGrid columns={3} spacing={4}>
            <SectionContainer title={"Length"}>
              <IWInput
                value={phaseForm?.length}
                onChange={({ target }) =>
                  setPhaseForm({ ...phaseForm, length: target.value })
                }
                placeholder="Length"
              />
            </SectionContainer>
            <SectionContainer title={"Vesting Period"}>
              <IWInput
                value={phaseForm?.vestingPeriod}
                onChange={({ target }) =>
                  setPhaseForm({ ...phaseForm, vestingPeriod: target.value })
                }
                placeholder="Vesting Period"
              />
            </SectionContainer>
            <SectionContainer title={"Initial Payout"}>
              <IWInput
                value={phaseForm?.initialPayout}
                onChange={({ target }) =>
                  setPhaseForm({ ...phaseForm, initialPayout: target.value })
                }
                placeholder="Initial Payout"
              />
            </SectionContainer>
          </SimpleGrid>
          <Box
            w={"full"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              w={{
                base: "full",
                lg: "-webkit-fit-content",
              }}
              alignSelf={{ base: "center" }}
              mt={"16px"}
              type="button"
              onClick={() => {}}
            >
              Add Phase
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Phase;
