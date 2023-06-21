import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";

const ProjectInfor = () => {
  const [projectInfor, setProjectInfor] = useState(null);
  return (
    <>
      <Box w={{ base: "full" }}>
        <SectionContainer title="Project Name">
          <IWInput
            value={projectInfor?.name}
            onChange={({ target }) =>
              setProjectInfor({ ...projectInfor, name: target.value })
            }
            placeholder="Project Name"
          />
        </SectionContainer>
        <SectionContainer title="Project Description">
          <IWTextArea
            value={projectInfor?.description}
            onChange={({ target }) =>
              setProjectInfor({ ...projectInfor, description: target.value })
            }
            placeholder="Project Description"
          />
        </SectionContainer>
        <SimpleGrid columns={2} spacing={4}>
          <SectionContainer title="Start Date & Time">
            <Flex
              h="52px"
              borderWidth="1px"
              justifyContent="start"
              borderRadius="5px"
            >
              <DateTimePicker
                locale="en-EN"
                value={projectInfor?.startTime || new Date()}
                onChange={(value) => console.log(value)}
              />
            </Flex>
          </SectionContainer>
          <SectionContainer title="End Date & Time">
            <Flex
              h="52px"
              borderWidth="1px"
              justifyContent="start"
              borderRadius="5px"
            >
              <DateTimePicker
                locale="en-EN"
                value={projectInfor?.endTime || new Date()}
                onChange={(value) => console.log(value)}
              />
            </Flex>
          </SectionContainer>
          <SectionContainer title="Website">
            <IWInput
              value={projectInfor?.website}
              onChange={({ target }) =>
                setProjectInfor({ ...projectInfor, website: target.value })
              }
              placeholder="Project Website"
            />
          </SectionContainer>
          <SectionContainer title="Twitter">
            <IWInput
              value={projectInfor?.twitter}
              onChange={({ target }) =>
                setProjectInfor({ ...projectInfor, twitter: target.value })
              }
              placeholder="Project Twitter"
            />
          </SectionContainer>
          <SectionContainer title="Discord">
            <IWInput
              value={projectInfor?.discord}
              onChange={({ target }) =>
                setProjectInfor({ ...projectInfor, discord: target.value })
              }
              placeholder="Project Discord"
            />
          </SectionContainer>
          <SectionContainer title="Telegram">
            <IWInput
              value={projectInfor?.telegram}
              onChange={({ target }) =>
                setProjectInfor({ ...projectInfor, telegram: target.value })
              }
              placeholder="Project Telegram"
            />
          </SectionContainer>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default ProjectInfor;
