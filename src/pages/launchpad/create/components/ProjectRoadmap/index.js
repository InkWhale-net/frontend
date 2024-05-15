import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Text,
} from "@chakra-ui/react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import { validationCollectionName, validationDescription } from "constants/yup";
import { Field, Form, Formik } from "formik";
import { BsTrashFill } from "react-icons/bs";
import { MdError } from "react-icons/md";
import * as Yup from "yup";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";

const ProjectRoadmap = () => {
  const { updateRoadmap, launchpadData, prevStep, nextStep } =
    useCreateLaunchpad();
  const projectRoadmap = launchpadData?.roadmap || [
    {
      name: "",
      description: "",
    },
  ];

  const validationSchema = Yup.array().of(
    Yup.object().shape({
      name: validationCollectionName,
      description: validationDescription,
    })
  );

  const handleSubmit = (values, actions) => {
    updateRoadmap(values);
    nextStep();
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={projectRoadmap}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Field name="name">
          {({ form }) =>
            form.values?.map((obj, index) => {
              return (
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
                  <FormControl
                    isInvalid={
                      form.errors[index]?.name && form.touched[index]?.name
                    }
                  >
                    <SectionContainer
                      right={
                        form.values?.length > 1 && (
                          <IconButton
                            borderRadius="0"
                            icon={<BsTrashFill color="#57527E" />}
                            variant="link"
                            onClick={() => {
                              form.setValues([
                                ...form.values.slice(0, index),
                                ...form.values.slice(index + 1),
                              ]);
                            }}
                          />
                        )
                      }
                      title={"Milestone Name"}
                      isRequiredLabel
                    >
                      <IWInput
                        autocomplete="off"
                        maxLength={60}
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
                        id={`name-roadmap-${index}`}
                        value={obj?.name}
                        placeholder="Milestone Name"
                      />
                      <Text
                        h="20px"
                        color="red"
                        textAlign="left"
                        fontSize="14px"
                        lineHeight="22px"
                      >
                        {form.errors?.[index]?.name ?? null}
                      </Text>
                    </SectionContainer>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      form.errors[index]?.description &&
                      form.touched[index]?.description
                    }
                  >
                    <SectionContainer
                      title="Milestone Description"
                      isRequiredLabel
                    >
                      <IWTextArea
                        maxLength={150}
                        value={obj?.description}
                        onChange={({ target }) => {
                          const updatedArray = [...form.values];
                          if (index >= 0 && index < updatedArray.length) {
                            updatedArray[index] = {
                              ...updatedArray[index],
                              description: target.value,
                            };
                          }
                          form.setValues(updatedArray);
                        }}
                        id={`description-roadmap-${index}`}
                        placeholder="Project Description"
                      />
                      <Text
                        h="20px"
                        color="red"
                        textAlign="left"
                        fontSize="14px"
                        lineHeight="22px"
                      >
                        {form.errors?.[index]?.description ?? null}
                      </Text>
                    </SectionContainer>
                  </FormControl>
                </Box>
              );
            })
          }
        </Field>

        <Flex justify="center">
          <Field name="description">
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
                      name: "",
                      description: "",
                    },
                  ]);
                }}
              >
                Add Milestone
              </Button>
            )}
          </Field>
        </Flex>
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
                      disabled={!!Object.entries(form.errors)?.length}
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

export default ProjectRoadmap;
