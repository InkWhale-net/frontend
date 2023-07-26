import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useEffect, useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";
import UploadImage from "pages/launchpad/UploadImage";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";

const ProjectInfor = () => {
  const { updateProjectInfor } = useCreateLaunchpad();
  const [projectInfor, setProjectInfor] = useState(null);
  useEffect(() => {
    updateProjectInfor(projectInfor);
  }, [projectInfor]);
  return (
    <>
      <SimpleGrid
        w="full"
        columns={{ base: 1, lg: 3 }}
        spacingX={{ lg: "20px" }}
        spacingY={{ base: "20px", lg: "32px" }}
        mb={{ base: "30px" }}
      >
        <UploadImage
          label="Avatar Image"
          keyInput={`project-infor-1`}
          previewSize={{ width: "120px", height: "120px" }}
          limitedSize={{
            width: "500",
            height: "500",
          }}
          iconUrl={projectInfor?.avatarImage}
          setImageIPFSUrl={(value) =>
            setProjectInfor({ ...projectInfor, avatarImage: value })
          }
        />
        <UploadImage
          isDisabled={!projectInfor?.avatarImage}
          label="Featured Image"
          keyInput={`project-infor-2`}
          previewSize={{ width: "180px", height: "120px" }}
          limitedSize={{
            width: "400",
            height: "260",
          }}
          iconUrl={projectInfor?.featureImage}
          setImageIPFSUrl={(value) =>
            setProjectInfor({ ...projectInfor, featureImage: value })
          }
        />
        <UploadImage
          isDisabled={
            !(projectInfor?.avatarImage && projectInfor?.featureImage)
          }
          label="Header Image"
          keyInput={`project-infor-3`}
          previewSize={{ width: "180px", height: "120px" }}
          limitedSize={{
            width: "1920",
            height: "600",
          }}
          iconUrl={projectInfor?.headerImage}
          setImageIPFSUrl={(value) =>
            setProjectInfor({ ...projectInfor, headerImage: value })
          }
        />
      </SimpleGrid>
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
                onChange={(value) =>
                  setProjectInfor({ ...projectInfor, startTime: value })
                }
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
                onChange={(value) =>
                  setProjectInfor({ ...projectInfor, endTime: value })
                }
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
