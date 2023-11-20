import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import { useEffect, useState } from "react";
import { BsTrashFill } from "react-icons/bs";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";

const ProjectRoadmap = () => {
  const { updateRoadmap, current, launchpadData, prevStep, nextStep } =
    useCreateLaunchpad();
  const [projectRoadmap, setProjectRoadmap] = useState([
    {
      name: null,
      description: null,
    },
  ]);
  const handleUpdateMilestone = () => {
    try {
      setProjectRoadmap([
        ...projectRoadmap,
        {
          name: null,
          description: null,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteMilestone = (index) => {
    setProjectRoadmap([
      ...projectRoadmap.slice(0, index),
      ...projectRoadmap.slice(index + 1),
    ]);
  };
  useEffect(() => {
    updateRoadmap(projectRoadmap);
  }, [projectRoadmap]);

  useEffect(() => {
    if (current === 2 && launchpadData?.roadmap)
      setProjectRoadmap(launchpadData?.roadmap);
  }, [current]);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Box w={{ base: "full" }}>
        {projectRoadmap?.map((obj, index) => (
          <Box
            bg={{ base: "#F6F6FC" }}
            borderRadius={{ base: "10px" }}
            paddingLeft={{ base: "20px" }}
            paddingRight={{ base: "20px" }}
            paddingTop={{ base: "8px" }}
            paddingBottom={{ base: "32px" }}
            sx={{ display: "flex", flexDirection: "column" }}
            mt="16px"
          >
            <SectionContainer
              right={
                projectRoadmap?.length > 1 && (
                  <IconButton
                    borderRadius="0"
                    icon={<BsTrashFill color="#57527E" />}
                    variant="link"
                    onClick={() => deleteMilestone(index)}
                  />
                )
              }
              title={"Milestone Name"}
              isRequiredLabel
            >
              <IWInput
                maxLength={60}
                value={obj?.name || ""}
                onChange={({ target }) => {
                  setProjectRoadmap((prevState) => {
                    const updatedArray = [...prevState];
                    if (index >= 0 && index < updatedArray.length) {
                      updatedArray[index] = {
                        ...updatedArray[index],
                        name: target.value,
                      };
                    }
                    return updatedArray;
                  });
                }}
                placeholder="Milestone Name"
              />
            </SectionContainer>
            <SectionContainer title="Milestone Description" isRequiredLabel>
              <IWTextArea
                maxLength={150}
                value={obj?.description || ""}
                onChange={({ target }) => {
                  setProjectRoadmap((prevState) => {
                    const updatedArray = [...prevState];
                    if (index >= 0 && index < updatedArray.length) {
                      updatedArray[index] = {
                        ...updatedArray[index],
                        description: target.value,
                      };
                    }
                    return updatedArray;
                  });
                }}
                placeholder="Project Description"
              />
            </SectionContainer>
          </Box>
        ))}
      </Box>

      <Button
        w={{
          base: "full",
          lg: "-webkit-fit-content",
        }}
        alignSelf={{ base: "center" }}
        mt={"16px"}
        type="button"
        onClick={() => handleUpdateMilestone()}
      >
        Add Milestone
      </Button>
      <Flex justify="center" mt="20px">
        <Button onClick={() => prevStep()} minW="100px">
          Previous
        </Button>
        <Button ml="8px" onClick={() => {
          console.log(launchpadData)
        }} minW="100px">
          Next
        </Button>
      </Flex>
    </div>
  );
};

export default ProjectRoadmap;
