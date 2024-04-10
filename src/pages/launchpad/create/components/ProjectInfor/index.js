import {
  Box,
  Button,
  Flex,
  FormControl,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import {
  validationCollectionName,
  validationDescription,
  validationDiscord,
  validationTelegram,
  validationTwitter,
  validationWebsite,
} from "constants/yup";
import { Field, Form, Formik } from "formik";
import UploadImage from "pages/launchpad/UploadImage";
import { useState } from "react";
import { MdError } from "react-icons/md";
import * as Yup from "yup";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";
import Tokenomic from "./Tokenomic";

const ProjectInfor = () => {
  const { updateProjectInfor, launchpadData, nextStep, prevStep } =
    useCreateLaunchpad();
  const [projectInfor, setProjectInfor] = useState({
    ...launchpadData?.projectInfor,
    project_name: launchpadData?.projectInfor?.name || "",
    description: launchpadData?.projectInfor?.description || "",
    avatarImage: launchpadData?.projectInfor?.avatarImage || "",
    featureImage: launchpadData?.projectInfor?.featureImage || "",
    youtubeUrl: launchpadData?.projectInfor?.youtubeUrl || "",
    website: launchpadData?.projectInfor?.website || "",
    twitter: launchpadData?.projectInfor?.twitter || "",
    discord: launchpadData?.projectInfor?.discord || "",
    telegram: launchpadData?.projectInfor?.telegram || "",
    tokenomic: launchpadData?.projectInfor?.telegram,
  });
  const validationSchema = Yup.object().shape({
    project_name: validationCollectionName,
    description: validationDescription,
    avatarImage: Yup.string().required("This field is required"),
    featureImage: Yup.string().required("This field is required"),
    youtubeUrl: Yup.string().matches(
      /^(https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]+)$/,
      "Invalid YouTube Embed URL format"
    ),
    website: validationWebsite,
    twitter: validationTwitter,
    discord: validationDiscord,
    telegram: validationTelegram,
  });
  const handleSubmit = (values, actions) => {
    updateProjectInfor({
      ...projectInfor,
      ...values,
      name: values?.project_name,
      tokenomic: projectInfor?.tokenomic,
    });
    nextStep();
    actions.setSubmitting(false);
  };

  const updateTokenomic = (value) => {
    setProjectInfor((prev) => ({ ...prev, tokenomic: value }));
  };

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
            {({ form }) => (
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
            {({ form }) => (
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
        </SimpleGrid>
        <Box w={{ base: "full" }}>
          <SectionContainer title="Project Name" isRequiredLabel>
            <Field name="project_name">
              {({ field, form, meta }) => (
                <FormControl
                  isInvalid={
                    form.errors.project_name && form.touched.project_name
                  }
                >
                  <IWInput
                    autocomplete="off"
                    maxLength={60}
                    onChange={({ target }) =>
                      form.setFieldValue("project_name", target.value)
                    }
                    id="project_name"
                    value={field.value}
                    placeholder="Project Name"
                  />
                  <Text
                    h="20px"
                    color="red"
                    textAlign="left"
                    fontSize="14px"
                    lineHeight="22px"
                  >
                    {meta.error ? meta.error : null}
                  </Text>
                </FormControl>
              )}
            </Field>
          </SectionContainer>
          <SectionContainer title="Project Description" isRequiredLabel>
            <Field name="description">
              {({ field, form, meta }) => (
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
                  <Text
                    h="20px"
                    color="red"
                    textAlign="left"
                    fontSize="14px"
                    lineHeight="22px"
                  >
                    {meta.error ? meta.error : null}
                  </Text>{" "}
                </FormControl>
              )}
            </Field>
          </SectionContainer>
          <SectionContainer title="Youtube intro link">
            <Field name="youtubeUrl">
              {({ field, form, meta }) => (
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
                  <Text
                    h="20px"
                    color="red"
                    textAlign="left"
                    fontSize="14px"
                    lineHeight="22px"
                  >
                    {meta.error ? meta.error : null}
                  </Text>{" "}
                </FormControl>
              )}
            </Field>
          </SectionContainer>

          <Tokenomic updateTokenomic={updateTokenomic} />

          <SectionContainer title="Tokenomics information">
            <IWTextArea
              maxLength={300}
              value={projectInfor?.tokenomicsMoreInfo}
              onChange={({ target }) =>
                setProjectInfor({
                  ...projectInfor,
                  tokenomicsMoreInfo: target.value,
                })
              }
              placeholder="Add more information about your tokenomics..."
            />
          </SectionContainer>

          <SimpleGrid columns={[1, 1, 2]} spacing={4}>
            <SectionContainer title="Website">
              <Field name="website">
                {({ field, form, meta }) => (
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
                    <Text
                      h="20px"
                      color="red"
                      textAlign="left"
                      fontSize="14px"
                      lineHeight="22px"
                    >
                      {meta.error ? meta.error : null}
                    </Text>{" "}
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
            <SectionContainer title="Twitter">
              <Field name="twitter">
                {({ field, form, meta }) => (
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
                    <Text
                      h="20px"
                      color="red"
                      textAlign="left"
                      fontSize="14px"
                      lineHeight="22px"
                    >
                      {meta.error ? meta.error : null}
                    </Text>{" "}
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
            <SectionContainer title="Discord">
              <Field name="discord">
                {({ field, form, meta }) => (
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
                    <Text
                      h="20px"
                      color="red"
                      textAlign="left"
                      fontSize="14px"
                      lineHeight="22px"
                    >
                      {meta.error ? meta.error : null}
                    </Text>{" "}
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
            <SectionContainer title="Telegram">
              <Field name="telegram">
                {({ field, form, meta }) => (
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

                    <Text
                      h="20px"
                      color="red"
                      textAlign="left"
                      fontSize="14px"
                      lineHeight="22px"
                    >
                      {meta.error ? meta.error : null}
                    </Text>
                  </FormControl>
                )}
              </Field>
            </SectionContainer>
          </SimpleGrid>
        </Box>
        <Flex justify="center" mt="20px">
          <Field>
            {({ form }) => {
              return (
                <>
                  <Button onClick={() => prevStep()} minW="100px">
                    Previous
                  </Button>
                  <Flex align="center">
                    <Button
                      disabled={!!Object?.entries(form?.errors)?.length}
                      mr="4px"
                      ml="8px"
                      type="submit"
                      minW="100px"
                    >
                      Next
                    </Button>
                  </Flex>
                </>
              );
            }}
          </Field>
        </Flex>
      </Form>
    </Formik>
  );
};

export default ProjectInfor;
