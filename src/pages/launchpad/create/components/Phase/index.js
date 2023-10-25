import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import { useEffect } from "react";
import { BsTrashFill } from "react-icons/bs";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { AzeroLogo } from "components/icons/Icons";

const Phase = () => {
  const {
    updatePhase,
    updateTotalSupply,
    launchpadData,
    current,
    updateRequireKyc,
  } = useCreateLaunchpad();

  const [phaseList, setPhaseList] = useState([
    {
      name: null,
      startDate: new Date(),
      endDate: new Date(),
      allowPublicSale: false,
      vestingLength: null,
      vestingUnit: null,
      immediateReleaseRate: null,
      phasePublicAmount: null,
      phasePublicPrice: null,
      whiteList: null,
      capAmount: null,
    },
  ]);
  const [totalSupply, setTotalSupply] = useState(null);
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
          vestingUnit: null,
          immediateReleaseRate: null,
          phasePublicAmount: null,
          phasePublicPrice: null,
          whiteList: null,
          capAmount: null,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseList]);
  useEffect(() => {
    updateTotalSupply(totalSupply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSupply]);
  useEffect(() => {
    if (current === 4) {
      window.scrollTo(0, 0);
      if (launchpadData?.phase) setPhaseList(launchpadData?.phase);
      if (launchpadData?.totalSupply)
        setTotalSupply(launchpadData?.totalSupply);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const onChangeImmediateReleaseRate = (value, index) => {
    if (+value <= 100) {
      setPhaseList((prevState) => {
        const updatedArray = [...prevState];
        if (index >= 0 && index < updatedArray.length) {
          updatedArray[index] = {
            ...updatedArray[index],
            immediateReleaseRate: value,
          };
        }
        return updatedArray;
      });
      if (parseFloat(value) === 100) {
        onChangeVestingDuration(0, index);
        onChangeVestingReleasePeriod(0, index);
      }
    }
  };

  const onChangeVestingDuration = (value, index) => {
    setPhaseList((prevState) => {
      const updatedArray = [...prevState];
      if (index >= 0 && index < updatedArray.length) {
        updatedArray[index] = {
          ...updatedArray[index],
          vestingLength: value,
        };
      }
      return updatedArray;
    });
  };

  const onChangeVestingReleasePeriod = (value, index) => {
    setPhaseList((prevState) => {
      const updatedArray = [...prevState];
      if (index >= 0 && index < updatedArray.length) {
        updatedArray[index] = {
          ...updatedArray[index],
          vestingUnit: value,
        };
      }
      return updatedArray;
    });
  };

  const onChangeCapAmount = (value, index) => {
    setPhaseList((prevState) => {
      const updatedArray = [...prevState];
      if (index >= 0 && index < updatedArray.length) {
        updatedArray[index] = {
          ...updatedArray[index],
          capAmount: value,
        };
      }
      return updatedArray;
    });
  };

  const [requireKyc, setRequireKyc] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SectionContainer title={"Total For Sale"}>
        <IWInput
          type="number"
          value={totalSupply}
          onChange={({ target }) => setTotalSupply(target.value)}
          placeholder="0"
          inputRightElementIcon={launchpadData?.token?.symbol}
        />
        <Text
          sx={{ mt: "8px" }}
        >{`Token balance: ${launchpadData?.token?.balance} ${launchpadData?.token?.symbol}`}</Text>
      </SectionContainer>
      {/* =========================== */}
      <Heading
        as="h2"
        size="h2"
        sx={{ marginTop: "16px" }}
        lineHeight={{ base: "1.25", lg: "30px" }}
      >
        KYC Verification (Know Your Customer)
        <Tooltip
          fontSize="md"
          label={`Lorem KYC Verification is Know Your Customer`}
        >
          <QuestionOutlineIcon ml="6px" color="text.2" />
        </Tooltip>
      </Heading>

      <Box
        bg={{ base: "#F6F6FC" }}
        borderRadius={{ base: "10px" }}
        padding={{ base: "30px" }}
        sx={{ display: "flex", flexDirection: "column" }}
        mt="16px"
      >
        <Box sx={{ display: "flex" }} mt="16px">
          <Heading
            as="h3"
            size="h3"
            mb="16px"
            lineHeight={{ base: "1.25", lg: "30px" }}
          >
            Required KYC
          </Heading>
          <Switch
            sx={{ mt: "4px", ml: "16px" }}
            id="require-kyc"
            isChecked={requireKyc}
            onChange={() => {
              updateRequireKyc(!requireKyc);
              setRequireKyc(!requireKyc);
            }}
          />
        </Box>
      </Box>

      {/* ================================================ */}
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
            key={`phase-${index}`}
          >
            <SimpleGrid columns={[1, 1, 3]} spacing={4}>
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
              <SectionContainer title={"Start"}>
                <Flex
                  h="52px"
                  borderWidth="1px"
                  justifyContent="start"
                  borderRadius="5px"
                  sx={{
                    "& .react-datetime-picker__calendar": {
                      zIndex: 9999,
                    },
                  }}
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
                title={"End"}
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
                  sx={{
                    "& .react-datetime-picker__calendar": {
                      zIndex: 9999,
                    },
                  }}
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
            <SimpleGrid columns={[1, 1, 4]} spacing={2}>
              <SectionContainer
                title={
                  <>
                    Phase Cap
                    <Tooltip fontSize="md" label={`Phase Cap explain`}>
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  </>
                }
              >
                <IWInput
                  type="number"
                  value={obj?.capAmount}
                  onChange={({ target }) =>
                    onChangeCapAmount(target.value, index)
                  }
                  placeholder="0"
                />
              </SectionContainer>
              <SectionContainer
                title={
                  <>
                    Initial Release Rate
                    <Tooltip
                      fontSize="md"
                      label={`Percentage or portion of tokens that are immediately released to token holders upon the token launch or distribution event`}
                    >
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  </>
                }
              >
                <IWInput
                  inputRightElementIcon={<b>%</b>}
                  type="number"
                  value={obj?.immediateReleaseRate}
                  onChange={({ target }) =>
                    onChangeImmediateReleaseRate(target.value, index)
                  }
                  placeholder="0.00"
                />
              </SectionContainer>
              <SectionContainer
                title={
                  <>
                    Vesting Duration
                    <Tooltip
                      fontSize="md"
                      label={`The Vesting Duration refers to the length of time over which tokens are gradually released to token holders according to a predetermined schedule`}
                    >
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  </>
                }
              >
                <IWInput
                  inputRightElementIcon={
                    <Tooltip
                      fontSize="md"
                      label={
                        "The vesting duration refers to the length of time over which a vesting schedule is applied"
                      }
                    >
                      <b>day(s)</b>
                    </Tooltip>
                  }
                  isDisabled={parseFloat(obj?.immediateReleaseRate) === 100}
                  type="number"
                  value={obj?.vestingLength}
                  onChange={({ target }) =>
                    onChangeVestingDuration(target.value, index)
                  }
                  placeholder="0"
                />
              </SectionContainer>
              <SectionContainer title={"Vesting Release Period"}>
                <IWInput
                  inputRightElementIcon={
                    <Tooltip
                      fontSize="md"
                      label={
                        "The Vesting Release Period is the interval or frequency at which vested tokens become accessible to the token holder according to the predetermined vesting schedule"
                      }
                    >
                      <b>day(s)</b>
                    </Tooltip>
                  }
                  isDisabled={parseFloat(obj?.immediateReleaseRate) === 100}
                  type="number"
                  value={obj?.vestingUnit}
                  onChange={({ target }) =>
                    onChangeVestingReleasePeriod(target.value, index)
                  }
                  placeholder="0"
                />
              </SectionContainer>

              {!requireKyc ? (
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
              ) : null}
            </SimpleGrid>
            {!requireKyc ? (
              <>
                {obj?.allowPublicSale && (
                  <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                    <SectionContainer title={"Public Amount"}>
                      <IWInput
                        type="number"
                        inputRightElementIcon={launchpadData?.token?.symbol}
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
                        placeholder="0"
                      />
                    </SectionContainer>
                    <SectionContainer title={"Phase Public Price"}>
                      <IWInput
                        type="number"
                        inputRightElementIcon={<AzeroLogo />}
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
                        placeholder="0.0000"
                      />
                    </SectionContainer>
                  </SimpleGrid>
                )}
                <Divider sx={{ marginTop: "8px" }} />
                <SectionContainer
                  title={
                    <>
                      White list
                      <Tooltip
                        fontSize="md"
                        label={`Enter one address, whitelist amount and price on each line.
                A decimal separator of amount must use dot (.)`}
                      >
                        <QuestionOutlineIcon ml="6px" color="text.2" />
                      </Tooltip>
                    </>
                  }
                >
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
                    placeholder={`Sample:\n5EfUESCp28GXw1v9CXmpAL5BfoCNW2y4skipcEoKAbN5Ykfn, 100, 0.1\n5ES8p7zN5kwNvvhrqjACtFQ5hPPub8GviownQeF9nkHfpnkL, 20, 2`}
                  />
                </SectionContainer>
              </>
            ) : null}
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
