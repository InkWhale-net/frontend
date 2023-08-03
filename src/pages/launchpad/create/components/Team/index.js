import { Box, Button, Heading, IconButton, SimpleGrid } from "@chakra-ui/react";
import IWInput from "components/input/Input";
import UploadImage from "pages/launchpad/UploadImage";
import { useState } from "react";
import { BsTrashFill } from "react-icons/bs";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";
import { useEffect } from "react";

const Team = () => {
  const { updateMember, current, launchpadData } = useCreateLaunchpad();
  const [teamList, setTeamList] = useState([
    {
      iconIPFSUrl: null,
      name: null,
      title: null,
      socialLink: null,
    },
  ]);
  const addMember = () => {
    try {
      setTeamList([
        ...teamList,
        {
          iconIPFSUrl: null,
          name: null,
          title: null,
          socialLink: null,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteMember = (index) => {
    setTeamList([...teamList.slice(0, index), ...teamList.slice(index + 1)]);
  };
  useEffect(() => {
    updateMember(teamList);
  }, [teamList]);
  useEffect(() => {
    if (current == 3 && launchpadData?.team) setTeamList(launchpadData?.team);
  }, [current]);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Heading
        as="h2"
        size="h2"
        mb="16px"
        lineHeight={{ base: "1.25", lg: "30px" }}
      >
        Add team member
      </Heading>
      {teamList.map((obj, index) => {
        return (
          <Box
            bg={{ base: "#F6F6FC" }}
            borderRadius={{ base: "10px" }}
            padding={{ base: "30px" }}
            sx={{ display: "flex", flexDirection: "column" }}
            mt="16px"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <UploadImage
                // isDisabled={!!!tokenInfo}
                // direction="horizontal"
                label="Upload member avatar"
                keyInput={`team-member-avatar-${index}`}
                previewSize={{ width: "120px", height: "120px" }}
                limitedSize={{
                  width: "512",
                  height: "512",
                }}
                previewUrl={teamList[index]?.previewAvatar}
                updatePreviewImage={(value) =>
                  setTeamList((prevState) => {
                    const updatedArray = [...prevState];
                    if (index >= 0 && index < updatedArray.length) {
                      updatedArray[index] = {
                        ...updatedArray[index],
                        previewAvatar: value,
                      };
                    }
                    return updatedArray;
                  })
                }
                iconUrl={obj?.iconIPFSUrl}
                setImageIPFSUrl={(value) =>
                  setTeamList((prevState) => {
                    const updatedArray = [...prevState];
                    if (index >= 0 && index < updatedArray.length) {
                      updatedArray[index] = {
                        ...updatedArray[index],
                        iconIPFSUrl: value,
                      };
                    }
                    return updatedArray;
                  })
                }
              />
              {teamList?.length > 1 && (
                <IconButton
                  borderRadius="0"
                  icon={<BsTrashFill color="#57527E" />}
                  variant="link"
                  sx={{ marginTop: "4px" }}
                  onClick={() => deleteMember(index)}
                />
              )}
            </Box>
            <SimpleGrid columns={[1, 3]} spacing={4}>
              <SectionContainer title={"Name"} isRequiredLabel>
                <IWInput
                  value={obj?.name}
                  onChange={({ target }) =>
                    setTeamList((prevState) => {
                      const updatedArray = [...prevState];
                      if (index >= 0 && index < updatedArray.length) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          name: target.value,
                        };
                      }
                      return updatedArray;
                    })
                  }
                  placeholder="Name"
                />
              </SectionContainer>
              <SectionContainer title={"Title"} isRequiredLabel>
                <IWInput
                  value={obj?.title}
                  onChange={({ target }) =>
                    setTeamList((prevState) => {
                      const updatedArray = [...prevState];
                      if (index >= 0 && index < updatedArray.length) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          title: target.value,
                        };
                      }
                      return updatedArray;
                    })
                  }
                  placeholder="Title"
                />
              </SectionContainer>
              <SectionContainer title={"Social Link"}>
                <IWInput
                  value={obj?.socialLink}
                  onChange={({ target }) =>
                    setTeamList((prevState) => {
                      const updatedArray = [...prevState];
                      if (index >= 0 && index < updatedArray.length) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          socialLink: target.value,
                        };
                      }
                      return updatedArray;
                    })
                  }
                  placeholder="Social Link"
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
            ></Box>
          </Box>
        );
      })}
      <Button
        w={{
          base: "full",
          lg: "-webkit-fit-content",
        }}
        alignSelf={{ base: "center" }}
        mt={"16px"}
        type="button"
        onClick={() => addMember()}
      >
        Add Member
      </Button>
    </div>
  );
};

export default Team;
