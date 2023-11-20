import {
  Box,
  Button,
  Fade,
  IconButton,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import IWInput from "components/input/Input";
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { BsTrashFill } from "react-icons/bs";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import SectionContainer from "../sectionContainer";

const DistributionTag = ({
  data,
  onChange,
  isDisabled,
  isNewValueValid,
  onDelete,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => onToggle(), []);
  return (
    <Fade in={isOpen} animateOpacity>
      <Box
        sx={{
          border: "2px solid #E3DFF3",
          py: "4px",
          px: "4px",
          display: "flex",
          borderRadius: "8px",
          mt: "8px",
        }}
      >
        {/* <Lorem count={1} /> */}
        <Box sx={{ flex: 1, display: "flex" }}>
          <IWInput
            maxLength={32}
            placeHolder="Distribution title"
            isDisabled={isDisabled}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            size="md"
            value={data?.label}
            onChange={(event) =>
              onChange({
                value: data?.value,
                label: event.target.value,
              })
            }
          />
          <IWInput
            isDisabled={isDisabled}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              ml: "2px",
            }}
            size="md"
            type="number"
            value={data?.value}
            onChange={(event) => {
              const newValue = parseFloat(event.target.value);
              if (isNewValueValid(newValue))
                onChange({
                  value: parseFloat(event.target.value),
                  label: data?.label,
                });
            }}
          />
        </Box>
        <IconButton
          ml="4px"
          variant="link"
          icon={
            data?.label != "Others" && (
              <BsTrashFill size={"16px"} color="#57527E" />
            )
          }
          onClick={() => data?.label != "Others" && onDelete()}
        />
      </Box>
    </Fade>
  );
};

const Tokenomic = ({ updateTokenomic, tokenomicValue }) => {
  const { updateProjectInfor, current, launchpadData } = useCreateLaunchpad();
  const [distribution, setDistribution] = useState(null);

  const currentTotalValue = useMemo(
    () =>
      distribution?.reduce((acc, obj) => {
        return acc + obj?.value;
      }, 0),
    [distribution]
  );
  const other = useMemo(() => 100 - currentTotalValue, [currentTotalValue]);

  useEffect(() => {
    if (
      distribution?.length > 0 &&
      distribution?.filter((e) => +e?.value > 0)?.length == distribution?.length
    ) {
      updateTokenomic(distribution);
    }
  }, [distribution]);
  useEffect(() => {
    if (current == 1) {
      setDistribution(
        launchpadData?.projectInfor?.tokenomic || [
          {
            label: "",
            value: 0,
          },
        ]
      );
    }
  }, [current]);
  return (
    <SectionContainer title="Tokenomic" sx={{ mt: "40px" }}>
      <SimpleGrid
        w="full"
        columns={{ base: 1, lg: 2 }}
        spacingX={{ lg: "20px" }}
        spacingY={{ base: "20px", lg: "32px" }}
        mb={{ base: "30px" }}
      >
        {distribution && (
          <ReactApexChart
            options={{
              chart: {
                type: "donut",
              },
              labels: [...distribution?.map((e) => e.label), "Others"],
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
            }}
            series={
              other > 0
                ? [...distribution?.map((e) => e.value), other]
                : distribution?.map((e) => e.value)
            }
            type="donut"
          />
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          You can add token distribution below, maximum total value is 100
          {distribution?.map((obj, index) => (
            <DistributionTag
              isNewValueValid={(value) => {
                return +currentTotalValue + +value - +obj.value <= 100;
              }}
              onDelete={() => {
                setDistribution((prev) =>
                  prev.filter((_, currentIndex) => index !== currentIndex)
                );
              }}
              onChange={({ label, value }) => {
                setDistribution((prevState) => {
                  const updatedArray = [...prevState];
                  if (index >= 0 && index < updatedArray.length) {
                    updatedArray[index] = {
                      ...updatedArray[index],
                      label: label,
                      value: value,
                    };
                  }
                  return updatedArray;
                });
              }}
              data={obj}
              key={`plan-tag-${index}`}
            />
          ))}
          {other > 0 && (
            <DistributionTag
              data={{
                label: "Others",
                value: other,
              }}
              isDisabled
            />
          )}
          <Button
            size="sm"
            mt="4px"
            onClick={() => {
              setDistribution((prev) => {
                return [
                  ...prev,
                  {
                    label: "",
                    value: 0,
                  },
                ];
              });
            }}
          >
            Add
          </Button>
        </div>
      </SimpleGrid>
    </SectionContainer>
  );
};

export default Tokenomic;
