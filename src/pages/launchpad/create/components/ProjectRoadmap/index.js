import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
} from "@chakra-ui/react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import { Field, Form, Formik } from "formik";
import { BsTrashFill } from "react-icons/bs";
import * as Yup from "yup";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";
import { MdError } from "react-icons/md";

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
      name: Yup.string().required("Name required"),
      description: Yup.string().required("Description required"),
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
        <Field>
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
                      <FormErrorMessage>
                        {form.errors[index]?.name}
                      </FormErrorMessage>
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
                      <FormErrorMessage>
                        {form.errors[index]?.description}
                      </FormErrorMessage>
                    </SectionContainer>
                  </FormControl>
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

export default ProjectRoadmap;
