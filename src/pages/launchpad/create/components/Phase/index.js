import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import { useEffect } from "react";
import { BsTrashFill } from "react-icons/bs";

const Phase = () => {
  const { updatePhase, updateTotalSupply } = useCreateLaunchpad();
  const [phaseList, setPhaseList] = useState([
    {
      name: null,
      startDate: new Date(),
      endDate: new Date(),
      allowPublicSale: false,
      vestingLength: null,
      vestingPeriod: null,
      immediateReleaseRate: null,
      phasePublicAmount: null,
      phasePublicPrice: null,
      whiteList: null,
    },
  ]);
  const [totalSupply, setTotalSupply] = useState(0);
  const addPhase = () => {
    try {
      setPhaseList([
        ...phaseList,
        {
          name: null,
          startDate: new Date(),
          endDate: new Date(),
          allowPublicSale: false,
          vestingLength: null,
          vestingPeriod: null,
          immediateReleaseRate: null,
          phasePublicAmount: null,
          phasePublicPrice: null,
          whiteList: null,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const deletePhase = (index) => {
    setPhaseList([...phaseList.slice(0, index), ...phaseList.slice(index + 1)]);
  };
  useEffect(() => {
    updatePhase(phaseList);
  }, [phaseList]);
  useEffect(() => {
    updateTotalSupply(totalSupply);
  }, [totalSupply]);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SectionContainer title={"Total supply"}>
        <IWInput
          value={totalSupply}
          onChange={({ target }) => setTotalSupply(target.value)}
          placeholder="Total supply"
        />
      </SectionContainer>
      <Heading
        sx={{ marginTop: "16px" }}
        as="h2"
        size="h2"
        // mb="8px"
        lineHeight={{ base: "1.25", lg: "30px" }}
      >
        Add Phase
      </Heading>
      {phaseList?.map((obj, index) => {
        return (
          <Box
            bg={{ base: "#F6F6FC" }}
            borderRadius={{ base: "10px" }}
            padding={{ base: "30px" }}
            sx={{ display: "flex", flexDirection: "column" }}
            mt="16px"
          >
            <SimpleGrid columns={3} spacing={4}>
              <SectionContainer title={"Name"}>
                <IWInput
                  value={obj?.name}
                  onChange={({ target }) =>
                    setPhaseList((prevState) => {
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
              <SectionContainer title={"Start Date & Time"}>
                <Flex
                  h="52px"
                  borderWidth="1px"
                  justifyContent="start"
                  borderRadius="5px"
                >
                  <DateTimePicker
                    locale="en-EN"
                    value={obj?.startDate || new Date()}
                    onChange={(value) =>
                      setPhaseList((prevState) => {
                        const updatedArray = [...prevState];
                        if (index >= 0 && index < updatedArray.length) {
                          updatedArray[index] = {
                            ...updatedArray[index],
                            startDate: value,
                          };
                        }
                        return updatedArray;
                      })
                    }
                  />
                </Flex>
              </SectionContainer>

              <SectionContainer
                title={"End Date & Time"}
                right={
                  phaseList?.length > 1 && (
                    <IconButton
                      borderRadius="0"
                      icon={<BsTrashFill color="#57527E" />}
                      variant="link"
                      sx={{ marginTop: "4px" }}
                      onClick={() => deletePhase(index)}
                    />
                  )
                }
              >
                <Flex
                  h="52px"
                  borderWidth="1px"
                  justifyContent="start"
                  borderRadius="5px"
                >
                  <DateTimePicker
                    locale="en-EN"
                    value={obj?.endDate || new Date()}
                    onChange={(value) =>
                      setPhaseList((prevState) => {
                        const updatedArray = [...prevState];
                        if (index >= 0 && index < updatedArray.length) {
                          updatedArray[index] = {
                            ...updatedArray[index],
                            endDate: value,
                          };
                        }
                        return updatedArray;
                      })
                    }
                  />
                </Flex>
              </SectionContainer>
            </SimpleGrid>
            <Heading
              as="h2"
              size="h2"
              // mb="16px"
              mt="16px"
              lineHeight={{ base: "1.25", lg: "30px" }}
            >
              Vesting Plan
            </Heading>
            <SimpleGrid columns={3} spacing={4}>
              <SectionContainer title={"Immediate Release Rate"}>
                <IWInput
                  value={obj?.immediateReleaseRate}
                  onChange={({ target }) =>
                    setPhaseList((prevState) => {
                      const updatedArray = [...prevState];
                      if (index >= 0 && index < updatedArray.length) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          immediateReleaseRate: target.value,
                        };
                      }
                      return updatedArray;
                    })
                  }
                  placeholder="Immediate Release Rate"
                />
              </SectionContainer>
              <SectionContainer title={"Duration"}>
                <IWInput
                  value={obj?.vestingLength}
                  onChange={({ target }) =>
                    setPhaseList((prevState) => {
                      const updatedArray = [...prevState];
                      if (index >= 0 && index < updatedArray.length) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          vestingLength: target.value,
                        };
                      }
                      return updatedArray;
                    })
                  }
                  placeholder="duration"
                />
              </SectionContainer>
              <SectionContainer title={"Vesting Unit"}>
                <IWInput
                  value={obj?.vestingUnit}
                  onChange={({ target }) =>
                    setPhaseList((prevState) => {
                      const updatedArray = [...prevState];
                      if (index >= 0 && index < updatedArray.length) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          vestingUnit: target.value,
                        };
                      }
                      return updatedArray;
                    })
                  }
                  placeholder="Vesting Unit"
                />
              </SectionContainer>

              <Box sx={{ display: "flex" }}>
                <Heading
                  as="h3"
                  size="h3"
                  mb="16px"
                  lineHeight={{ base: "1.25", lg: "30px" }}
                >
                  Allow Public Sale
                </Heading>
                <Switch
                  sx={{ mt: "4px", ml: "16px" }}
                  id="zero-reward-pools"
                  isChecked={obj?.allowPublicSale}
                  onChange={() =>
                    setPhaseList((prevState) => {
                      const updatedArray = [...prevState];
                      if (index >= 0 && index < updatedArray.length) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          allowPublicSale: !obj?.allowPublicSale,
                        };
                      }
                      return updatedArray;
                    })
                  }
                />
              </Box>
            </SimpleGrid>
            {obj?.allowPublicSale && (
              <SimpleGrid columns={3} spacing={4}>
                <SectionContainer title={"Public Amount"}>
                  <IWInput
                    value={obj?.phasePublicAmount}
                    onChange={({ target }) =>
                      setPhaseList((prevState) => {
                        const updatedArray = [...prevState];
                        if (index >= 0 && index < updatedArray.length) {
                          updatedArray[index] = {
                            ...updatedArray[index],
                            phasePublicAmount: target.value,
                          };
                        }
                        return updatedArray;
                      })
                    }
                    placeholder="Public Amount"
                  />
                </SectionContainer>
                <SectionContainer title={"Phase Public Price"}>
                  <IWInput
                    value={obj?.phasePublicPrice}
                    onChange={({ target }) =>
                      setPhaseList((prevState) => {
                        const updatedArray = [...prevState];
                        if (index >= 0 && index < updatedArray.length) {
                          updatedArray[index] = {
                            ...updatedArray[index],
                            phasePublicPrice: target.value,
                          };
                        }
                        return updatedArray;
                      })
                    }
                    placeholder="Phase Public Price"
                  />
                </SectionContainer>
              </SimpleGrid>
            )}
            <SectionContainer title="White list">
              <IWTextArea
                sx={{
                  height: "80px",
                }}
                value={obj?.whiteList}
                onChange={({ target }) =>
                  setPhaseList((prevState) => {
                    const updatedArray = [...prevState];
                    if (index >= 0 && index < updatedArray.length) {
                      updatedArray[index] = {
                        ...updatedArray[index],
                        whiteList: target.value,
                      };
                    }
                    return updatedArray;
                  })
                }
                placeholder="Enter one address, whitelist amount and price on each line.
                A decimal separator of amount must use dot (.)
                Example: for WL amount 50 and price 2.99 Azero 
                5GRdmMkKeKaV94qU3JjDr2ZwRAgn3xwzd2FEJYKjjSFipiAe,50,2.99"
              />
            </SectionContainer>
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
        onClick={() => addPhase()}
      >
        Add Phase
      </Button>
    </div>
  );
};

export default Phase;
