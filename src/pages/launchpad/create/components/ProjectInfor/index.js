import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  SimpleGrid,
} from "@chakra-ui/react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import { Field, Form, Formik } from "formik";
import UploadImage from "pages/launchpad/UploadImage";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";
import Tokenomic from "./Tokenomic";

const ProjectInfor = () => {
  const { updateProjectInfor, current, launchpadData, nextStep, prevStep } =
    useCreateLaunchpad();
  const [projectInfor, setProjectInfor] = useState({
    project_name: "",
    description: "",
    avatarImage: "",
    featureImage: "",
    headerImage: "",
    youtubeUrl: "",
    website: "",
    twitter: "",
    discord: "",
    telegram: "",
  });

  const validationSchema = Yup.object().shape({
    project_name: Yup.string().required("Project name is required"),
    description: Yup.string().required("Description is required"),
    avatarImage: Yup.string().required("This field is required"),
    featureImage: Yup.string().required("This field is required"),
    headerImage: Yup.string().required("This field is required"),
    youtubeUrl: Yup.string().matches(
      /^(https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]+)$/,
      "Invalid YouTube URL format"
    ),
    website: Yup.string().url("Invalid URL format"),
    twitter: Yup.string().url("Invalid URL format"),
    discord: Yup.string().url("Invalid URL format"),
    telegram: Yup.string().url("Invalid URL format"),
  });
  const handleSubmit = (values, actions) => {
    updateProjectInfor({ ...values, name: values?.project_name });
    nextStep();
    actions.setSubmitting(false);
  };

  const updateTokenomic = (value) =>
    setProjectInfor((prev) => ({ ...prev, tokenomic: value }));

  // useEffect(() => {
  //   updateProjectInfor(projectInfor);
  //   console.log(projectInfor);
  // }, [projectInfor]);
  useEffect(() => {
    if (current == 1 && launchpadData?.projectInfor)
      setProjectInfor(launchpadData?.projectInfor);
  }, [current]);
  return (
    <Formik
      initialValues={projectInfor}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <SimpleGrid
          w="full"
          columns={{ base: 1, lg: 3 }}
          spacingX={{ lg: "20px" }}
          spacingY={{ base: "20px", lg: "32px" }}
          mb={{ base: "30px" }}
        >
          <Field name="avatarImage">
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.avatarImage}>
                <UploadImage
                  errorLabel={form.errors.avatarImage}
                  label="Avatar Image"
                  keyInput={`project-infor-1`}
                  previewSize={{ width: "120px", height: "120px" }}
                  limitedSize={{
                    width: "500",
                    height: "500",
                  }}
                  previewUrl={projectInfor?.previewAvatar}
                  updatePreviewImage={(value) =>
                    setProjectInfor((prev) => ({
                      ...prev,
                      previewAvatar: value,
                    }))
                  }
                  iconUrl={projectInfor?.avatarImage}
                  setImageIPFSUrl={(value) => {
                    form.setFieldValue("avatarImage", value);
                  }}
                />
              </FormControl>
            )}
          </Field>
          <Field name="featureImage">
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.featureImage}>
                <UploadImage
                  errorLabel={form.errors.featureImage}
                  label="Featured Image"
                  keyInput={`project-infor-2`}
                  previewSize={{ width: "180px", height: "120px" }}
                  limitedSize={{
                    width: "400",
                    height: "260",
                  }}
                  previewUrl={projectInfor?.previewFeatureImage}
                  updatePreviewImage={(value) =>
                    setProjectInfor((prev) => ({
                      ...prev,
                      previewFeatureImage: value,
                    }))
                  }
                  iconUrl={projectInfor?.featureImage}
                  setImageIPFSUrl={(value) =>
                    form.setFieldValue("featureImage", value)
                  }
                />
              </FormControl>
            )}
          </Field>
          <Field name="headerImage">
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.headerImage}>
                <UploadImage
                  errorLabel={form.errors.headerImage}
                  label="Header Image"
                  keyInput={`project-infor-3`}
                  previewSize={{ width: "180px", height: "120px" }}
                  limitedSize={{
                    width: "1920",
                    height: "600",
                  }}
                  previewUrl={projectInfor?.previewHeaderImage}
                  updatePreviewImage={(value) =>
                    setProjectInfor((prev) => ({
                      ...prev,
                      previewHeaderImage: value,
                    }))
                  }
                  iconUrl={projectInfor?.headerImage}
                  setImageIPFSUrl={(value) =>
                    form.setFieldValue("headerImage", value)
                  }
                />
              </FormControl>
            )}
          </Field>
        </SimpleGrid>
        <Box w={{ base: "full" }}>
          <SectionContainer title="Project Name" isRequiredLabel>
            <Field name="project_name">
              {({ field, form }) => (
                <FormControl
                  isInvalid={
                    form.errors.project_name && form.touched.project_name
                  }
                >
                  <IWInput
                    maxLength={60}
                    onChange={({ target }) =>
                      form.setFieldValue("project_name", target.value)
                    }
                    id="project_name"
                    value={field.value}
                    placeholder="Project Name"
                  />
                  <FormErrorMessage>
                    {form.errors.project_name}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </SectionContainer>
          <SectionContainer title="Project Description" isRequiredLabel>
            <Field name="description">
              {({ field, form }) => (
                <FormControl
                  isInvalid={
                    form.errors.description && form.touched.description
                  }
                >
                  <IWTextArea
                    id="description"
                    maxLength={300}
                    value={field.value}
                    onChange={({ target }) =>
                      form.setFieldValue("description", target.value)
                    }
                    placeholder="Project Description"
                  />
                  <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </SectionContainer>
          <SectionContainer title="Youtube intro link">
            <Field name="youtubeUrl">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.youtubeUrl && form.touched.youtubeUrl}
                >
                  <IWInput
                    maxLength={100}
                    value={field.value}
                    onChange={({ target }) =>
                      form.setFieldValue("youtubeUrl", target.value)
                    }
                    placeholder="https://www.youtube.com/embed/fwK7ggA3-bU"
                  />
                  <FormErrorMessage>{form.errors.youtubeUrl}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </SectionContainer>
          <Tokenomic updateTokenomic={updateTokenomic} />
          <SectionContainer title="Tokenomics more info">
            <IWTextArea
              maxLength={300}
              value={projectInfor?.tokenomicsMoreInfo}
              onChange={({ target }) =>
                setProjectInfor({
                  ...projectInfor,
                  tokenomicsMoreInfo: target.value,
                })
              }
              placeholder="Tokenomics more information"
            />
          </SectionContainer>
          <SimpleGrid columns={[1, 1, 2]} spacing={4}>
            <SectionContainer title="Website">
              <Field name="website">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.website && form.touched.website}
                  >
                    <IWInput
                      value={field.value}
                      onChange={({ target }) =>
                        form.setFieldValue("website", target.value)
                      }
                      placeholder="Project Website"
                    />

                    <FormErrorMessage>{form.errors.website}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
            <SectionContainer title="Twitter">
              <Field name="twitter">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.twitter && form.touched.twitter}
                  >
                    <IWInput
                      value={field.value}
                      onChange={({ target }) =>
                        form.setFieldValue("twitter", target.value)
                      }
                      placeholder="Project Twitter"
                    />

                    <FormErrorMessage>{form.errors.twitter}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
            <SectionContainer title="Discord">
              <Field name="discord">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.discord && form.touched.discord}
                  >
                    <IWInput
                      value={field.value}
                      onChange={({ target }) =>
                        form.setFieldValue("discord", target.value)
                      }
                      placeholder="Project Discord"
                    />

                    <FormErrorMessage>{form.errors.discord}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
            <SectionContainer title="Telegram">
              <Field name="telegram">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.telegram && form.touched.telegram}
                  >
                    <IWInput
                      value={field.value}
                      onChange={({ target }) =>
                        form.setFieldValue("telegram", target.value)
                      }
                      placeholder="Project Telegram"
                    />

                    <FormErrorMessage>{form.errors.telegram}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
          </SimpleGrid>
        </Box>
        <Flex justify="center" mt="20px">
          <Button onClick={() => prevStep()} minW="100px">
            Previous
          </Button>
          <Button ml="8px" type="submit" minW="100px">
            Next
          </Button>
        </Flex>
      </Form>
    </Formik>
  );
};

export default ProjectInfor;
