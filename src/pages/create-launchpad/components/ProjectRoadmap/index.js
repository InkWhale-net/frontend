import { Box, Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";
import FlatContainer from "./FlatContainer";

const ProjectRoadmap = () => {
  const [projectRoadmap, setProjectRoadmap] = useState([]);
  const [milestoneInfor, setMilestoneInfor] = useState(null);
  const handleAddMilestone = () => {
    try {
      //   if (
      //     milestoneInfor?.name?.length > 0 &&
      //     milestoneInfor?.description?.length
      //   ) {
      //     setProjectRoadmap([...projectRoadmap, milestoneInfor]);
      //     setMilestoneInfor(null);
      //   }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box w={{ base: "full" }}>
        {projectRoadmap?.map((obj, index) => (
          <FlatContainer title={obj?.name}>
            <SectionContainer title="Project Description">
              <Box
                borderWidth={1}
                borderRadius={"10px"}
                padding={"10px"}
                mt={"12px"}
                bg={"#FFF"}
              >
                <Text>{obj?.description}</Text>
              </Box>
            </SectionContainer>
          </FlatContainer>
        ))}
      </Box>
      <Box
        bg={{ base: "#F6F6FC" }}
        borderRadius={{ base: "10px" }}
        padding={{ base: "30px" }}
        sx={{ display: "flex", flexDirection: "column" }}
        mt="16px"
      >
        <SectionContainer title={"Milestone Name"}>
          <IWInput
            value={projectRoadmap?.name || ""}
            onChange={({ target }) =>
              setProjectRoadmap({ ...projectRoadmap, name: target.value })
            }
            placeholder="Milestone Name"
          />
        </SectionContainer>
        <SectionContainer title="Project Description">
          <IWTextArea
            value={projectRoadmap?.description || ""}
            onChange={({ target }) =>
              setProjectRoadmap({
                ...projectRoadmap,
                description: target.value,
              })
            }
            placeholder="Project Description"
          />
        </SectionContainer>
        <Button
          w={{
            base: "full",
            lg: "-webkit-fit-content",
          }}
          alignSelf={{ base: "center" }}
          mt={"16px"}
          type="button"
          onClick={() => handleAddMilestone()}
        >
          Add Milestone
        </Button>
      </Box>
    </>
  );
};

export default ProjectRoadmap;
