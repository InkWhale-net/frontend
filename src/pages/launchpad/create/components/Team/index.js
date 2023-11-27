import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import IWInput from "components/input/Input";
import { Field, Form, Formik } from "formik";
import UploadImage from "pages/launchpad/UploadImage";
import { useState } from "react";
import { BsTrashFill } from "react-icons/bs";
import * as Yup from "yup";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";
import { MdError } from "react-icons/md";
import { validationWebsite } from "constants/yup";

const Team = () => {
  const { updateMember, launchpadData, prevStep, nextStep } =
    useCreateLaunchpad();
  const [teamList, setTeamList] = useState(
    launchpadData?.team || [
      {
        iconIPFSUrl: "",
        name: "",
        title: "",
        socialLink: "",
      },
    ]
  );
  const validationSchema = Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name required"),
      iconIPFSUrl: Yup.string().required("Avatar required"),
      title: Yup.string().required("Title required"),
      socialLink: validationWebsite,
    })
  );

  const handleSubmit = (values, actions) => {
    updateMember(values);
    nextStep();
    actions.setSubmitting(false);
  };
  return (
    <Formik
      initialValues={teamList}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Heading
          as="h2"
          size="h2"
          mb="16px"
          lineHeight={{ base: "1.25", lg: "30px" }}
        >
          Add team member
        </Heading>
        <Field>
          {({ form }) =>
            form.values?.map((obj, index) => {
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
                    <FormControl isInvalid={form.errors[index]?.iconIPFSUrl}>
                      <UploadImage
                        errorLabel={form.errors[index]?.iconIPFSUrl}
                        label="Upload member avatar"
                        keyInput={`team-member-avatar-${index}`}
                        previewSize={{ width: "120px", height: "120px" }}
                        limitedSize={{
                          width: "512",
                          height: "512",
                        }}
                        previewUrl={teamList[index]?.previewAvatar}
                        updatePreviewImage={(value) => {
                          const updatedArray = [...form.values];
                          if (index >= 0 && index < updatedArray.length) {
                            updatedArray[index] = {
                              ...updatedArray[index],
                              previewAvatar: value,
                            };
                          }
                          form.setValues(updatedArray);
                        }}
                        iconUrl={obj?.iconIPFSUrl}
                        setImageIPFSUrl={(value) => {
                          const updatedArray = [...form.values];
                          if (index >= 0 && index < updatedArray.length) {
                            updatedArray[index] = {
                              ...updatedArray[index],
                              iconIPFSUrl: value,
                            };
                          }
                          form.setValues(updatedArray);
                        }}
                      />
                    </FormControl>
                    {form.values?.length > 1 && (
                      <IconButton
                        borderRadius="0"
                        icon={<BsTrashFill color="#57527E" />}
                        variant="link"
                        sx={{ marginTop: "4px" }}
                        onClick={() => {
                          form.setValues([
                            ...form.values.slice(0, index),
                            ...form.values.slice(index + 1),
                          ]);
                        }}
                      />
                    )}
                  </Box>
                  <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                    <FormControl
                      isInvalid={
                        form.errors[index]?.name && form.touched[index]?.name
                      }
                    >
                      <SectionContainer title="Name" isRequiredLabel>
                        <IWInput
                          value={obj?.name}
                          onChange={({ target }) => {
                            const updatedArray = [...form.values];
                            if (index >= 0 && index < updatedArray.length) {
                              updatedArray[index] = {
                                ...updatedArray[index],
                                name: target.value,
                              };
                            }
                            form.setValues(updatedArray);
                          }}
                          placeholder="Name"
                        />
                        <FormErrorMessage>
                          {form.errors[index]?.name}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        form.errors[index]?.title && form.touched[index]?.title
                      }
                    >
                      <SectionContainer title="Title" isRequiredLabel>
                        <IWInput
                          value={obj?.title}
                          onChange={({ target }) => {
                            const updatedArray = [...form.values];
                            if (index >= 0 && index < updatedArray.length) {
                              updatedArray[index] = {
                                ...updatedArray[index],
                                title: target.value,
                              };
                            }
                            form.setValues(updatedArray);
                          }}
                          placeholder="Title"
                        />
                        <FormErrorMessage>
                          {form.errors[index]?.title}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        form.errors[index]?.socialLink &&
                        form.touched[index]?.socialLink
                      }
                    >
                      <SectionContainer title="Social Link">
                        <IWInput
                          value={obj?.socialLink}
                          onChange={({ target }) => {
                            const updatedArray = [...form.values];
                            if (index >= 0 && index < updatedArray.length) {
                              updatedArray[index] = {
                                ...updatedArray[index],
                                socialLink: target.value,
                              };
                            }
                            form.setValues(updatedArray);
                          }}
                          placeholder="Social Link"
                        />
                        <FormErrorMessage>
                          {form.errors[index]?.socialLink}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>
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
            })
          }
        </Field>
        <Flex justify="center">
          <Field>
            {({ form }) => (
              <Button
                w={{
                  base: "full",
                  lg: "-webkit-fit-content",
                }}
                alignSelf={{ base: "center" }}
                mt={"16px"}
                type="button"
                onClick={() => {
                  form.setValues([
                    ...form.values,
                    {
                      iconIPFSUrl: "",
                      name: "",
                      title: "",
                      socialLink: "",
                    },
                  ]);
                }}
              >
                Add Member
              </Button>
            )}
          </Field>
        </Flex>

        <Flex justify="center" mt="20px">
          <Button onClick={() => prevStep()} minW="100px">
            Previous
          </Button>
          <Flex align="center">
            <Button mr="4px" ml="8px" type="submit" minW="100px">
              Next
            </Button>
            <Field>
              {({ form }) =>
                Object.entries(form.errors)?.length > 0 && (
                  <MdError color="red" />
                )
              }
            </Field>
          </Flex>
        </Flex>
      </Form>
    </Formik>
  );
};

export default Team;
