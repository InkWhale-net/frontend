import { Box, Button, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";
import FlatContainer from "../ProjectRoadmap/FlatContainer";
import ImageUploadIcon from "pages/create/token/UploadIcon";

const Team = () => {
  const [iconIPFSUrl, setIconIPFSUrl] = useState(null);
  const [memberForm, setMemberForm] = useState(null);
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
            Add team member
          </Heading>
          <SectionContainer title={"Upload Token Avatar"}>
            <ImageUploadIcon
              iconUrl={iconIPFSUrl}
              setImageIPFSUrl={setIconIPFSUrl}
              keyInput={0}
            />
          </SectionContainer>
          <SimpleGrid columns={3} spacing={4}>
            <SectionContainer title={"Name"}>
              <IWInput
                value={memberForm?.name}
                onChange={({ target }) =>
                  setMemberForm({ ...memberForm, name: target.value })
                }
                placeholder="Name"
              />
            </SectionContainer>
            <SectionContainer title={"Title"}>
              <IWInput
                value={memberForm?.title}
                onChange={({ target }) =>
                  setMemberForm({ ...memberForm, title: target.value })
                }
                placeholder="Title"
              />
            </SectionContainer>
            <SectionContainer title={"Social Link"}>
              <IWInput
                value={memberForm?.socialLink}
                onChange={({ target }) =>
                  setMemberForm({ ...memberForm, socialLink: target.value })
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
              Add Member
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Team;
