import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import UploadImage from "pages/launchpad/UploadImage";
import { useEffect, useState } from "react";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";
import Tokenomic from "./Tokenomic";
import { useFormik } from "formik";

const ProjectInfor = () => {
  const { updateProjectInfor, current, launchpadData } = useCreateLaunchpad();
  const [projectInfor, setProjectInfor] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values); // You can replace this with your form submission logic
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // Mark all fields as touched to trigger validation and red border
    formik.setTouched({
      email: true,
      password: true,
    });

    // Submit the form if it's valid
    if (formik.isValid) {
      formik.handleSubmit();
    }
  };

  const updateTokenomic = (value) =>
    setProjectInfor((prev) => ({ ...prev, tokenomic: value }));

  useEffect(() => {
    updateProjectInfor(projectInfor);
  }, [projectInfor]);
  useEffect(() => {
    if (current == 1 && launchpadData?.projectInfor)
      setProjectInfor(launchpadData?.projectInfor);
  }, [current]);
  return (
    <>
      <SimpleGrid
        w="full"
        columns={{ base: 1, lg: 3 }}
        spacingX={{ lg: "20px" }}
        spacingY={{ base: "20px", lg: "32px" }}
        mb={{ base: "30px" }}
      >
        <Box>
          {/* <Text sx={{ color: "red" }}>This field must not be empty</Text> */}
          <UploadImage
            label="Avatar Image"
            keyInput={`project-infor-1`}
            previewSize={{ width: "120px", height: "120px" }}
            limitedSize={{
              width: "500",
              height: "500",
            }}
            previewUrl={projectInfor?.previewAvatar}
            updatePreviewImage={(value) =>
              setProjectInfor((prev) => ({ ...prev, previewAvatar: value }))
            }
            iconUrl={projectInfor?.avatarImage}
            setImageIPFSUrl={(value) =>
              setProjectInfor((prev) => ({ ...prev, avatarImage: value }))
            }
          />
        </Box>
        <UploadImage
          isDisabled={!projectInfor?.avatarImage}
          label="Featured Image"
          keyInput={`project-infor-2`}
          previewSize={{ width: "180px", height: "120px" }}
          limitedSize={{
            width: "400",
            height: "260",
          }}
          previewUrl={projectInfor?.previewFeatureImage}
          updatePreviewImage={(value) =>
            setProjectInfor((prev) => ({ ...prev, previewFeatureImage: value }))
          }
          iconUrl={projectInfor?.featureImage}
          setImageIPFSUrl={(value) =>
            setProjectInfor((prev) => ({ ...prev, featureImage: value }))
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
          previewUrl={projectInfor?.previewHeaderImage}
          updatePreviewImage={(value) =>
            setProjectInfor((prev) => ({ ...prev, previewHeaderImage: value }))
          }
          iconUrl={projectInfor?.headerImage}
          setImageIPFSUrl={(value) =>
            setProjectInfor((prev) => ({ ...prev, headerImage: value }))
          }
        />
      </SimpleGrid>
      <Box w={{ base: "full" }}>
        <SectionContainer title="Project Name" isRequiredLabel>
          <IWInput
            maxLength={60}
            value={projectInfor?.name}
            onChange={({ target }) => {
              setProjectInfor({ ...projectInfor, name: target.value });
            }}
            placeholder="Project Name"
          />
        </SectionContainer>
        <SectionContainer title="Project Description" isRequiredLabel>
          <IWTextArea
            maxLength={300}
            value={projectInfor?.description}
            onChange={({ target }) =>
              setProjectInfor({ ...projectInfor, description: target.value })
            }
            placeholder="Project Description"
          />
        </SectionContainer>
        <Tokenomic updateTokenomic={updateTokenomic} />
        <SimpleGrid columns={[1, 1, 2]} spacing={4}>
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
