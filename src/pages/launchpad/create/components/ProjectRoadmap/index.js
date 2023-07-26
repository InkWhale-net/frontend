import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";
import FlatContainer from "./FlatContainer";
import { BsTrashFill } from "react-icons/bs";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import { useEffect } from "react";

const ProjectRoadmap = () => {
  const { updateRoadmap } = useCreateLaunchpad();
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
            >
              <IWInput
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
            <SectionContainer title="Milestone Description">
              <IWTextArea
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
    </div>
  );
};

export default ProjectRoadmap;
