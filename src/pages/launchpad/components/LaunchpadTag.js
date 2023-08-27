import {
  Box,
  Button,
  Divider,
  Heading,
  Image,
  Progress,
  Text,
} from "@chakra-ui/react";
import {
  IWStatus,
  IWStatusWithCountDown,
} from "components/countdown/StatusWithCountDown";
import { useHistory } from "react-router-dom";
import { EndStatusTag, LiveStatusTag, UpcomingStatusTag } from "./StatusTag";
import { useMemo } from "react";
import Countdown, { zeroPad } from "react-countdown";
import FadeIn from "react-fade-in/lib/FadeIn";
const SaleCount = ({ label, time, direction }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <></>;
    } else {
      return (
        <Box display="flex">
          <Text sx={{ fontWeight: "bold", color: "#57527E" }}>{`${zeroPad(
            days
          )}:${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`}</Text>
        </Box>
      );
    }
  };
  return (
    <Box>
      <Text>{label}</Text>
      {time ? (
        <Countdown date={time} renderer={renderer} />
      ) : (
        <Text sx={{ fontWeight: "bold", color: "#57527E" }}>
          {`00:00:00:00`}
        </Text>
      )}
    </Box>
  );
};
const IWCountDown = ({ saleTime, launchpadData }) => {
  const renderer = ({ completed }) => {
    const now = Date.now();
    const livePhase = saleTime?.find((e) => {
      return now > e.startTime && now < e.endTime;
    });
    const nearestPhase = saleTime?.reduce((acc, object) => {
      if (!acc && object?.startTime > now) return object;
      else {
        if (acc?.startTime > object?.startTime && object?.startTime > now)
          return object;
        else return acc;
      }
    }, null);
    if (completed) {
      return <SaleCount label="Project ended" />;
    } else if (livePhase) {
      return (
        <SaleCount label="Current phase ends in" time={livePhase?.endTime} />
      );
    } else if (nearestPhase) {
      return (
        <SaleCount
          label={
            nearestPhase?.id == 0 ? "Project starts in" : "Next phase starts in"
          }
          time={nearestPhase?.startTime}
        />
      );
    }
    return null;
  };
  const endTime = saleTime[saleTime?.length - 1]?.endTime;
  if (saleTime?.length > 0)
    return <Countdown date={endTime} renderer={renderer} />;
  else return null;
};

const LaunchpadTag = ({ launchpadData }) => {
  const history = useHistory();
  const { launchpadContract, projectInfo } = launchpadData;
  const { projectInfor } = projectInfo || {};
  const projectTime = useMemo(() => {
    return {
      startTime: new Date(
        parseInt(launchpadData?.startTime?.replace(/,/g, ""))
      ),
      endTime: new Date(parseInt(launchpadData?.endTime?.replace(/,/g, ""))),
    };
  }, [launchpadData]);
  const saleTime = useMemo(
    () =>
      launchpadData?.phaseList.map((e, index) => ({
        ...e,
        id: index,
        startTime: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
        endTime: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
      })),
    [launchpadData]
  );
  console.log(projectInfo?.token)
  return (
    <FadeIn>
      <Box
        _hover={{
          borderColor: "brand.500",
          transition: "border 300ms ease-in-out",
          cursor: "pointer",
        }}
        sx={{
          width: "full",
          border: "4px solid #E3DFF3",
          borderRadius: "8px",
          padding: "20px",
          paddingBottom: "16px",
          transition: "border 300ms ease-in-out",
        }}
        onClick={() => {
          history.push({
            pathname: `/launchpad/${launchpadContract}`,
          });
        }}
      >
        <div style={{ position: "relative" }}>
          <Image
            fit={"cover"}
            h="160px"
            w="full"
            alt="avatar"
            boxShadow="base"
            objectFit="cover"
            objectPosition="center"
            filter="brightness(0.4)"
            borderRadius="4px"
            src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}/${projectInfo?.projectInfor?.headerImage}`}
          />
          <IWStatus
            isActive={launchpadData.isActive}
            startDate={projectTime?.startTime}
            endDate={projectTime?.endTime}
            liveRender={<LiveStatusTag />}
            upcomingRender={<UpcomingStatusTag />}
            endRender={<EndStatusTag />}
          />

          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              zIndex: 2,
              width: "full",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Image
              h="60px"
              w="60px"
              borderRadius="80px"
              alt="avatar"
              boxShadow="base"
              objectFit="cover"
              objectPosition="center"
              src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}/${projectInfo?.projectInfor?.avatarImage}`}
            />
          </div>
        </div>

        <div style={{ marginTop: "8px" }}>
          <Heading size="h3">{projectInfo?.projectInfor?.name}</Heading>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <Image
              h="40px"
              w="40px"
              borderRadius="80px"
              alt="avatar"
              boxShadow="base"
              objectFit="cover"
              objectPosition="center"
              src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${projectInfo?.token?.tokenIconUrl}`}
            />
            <div>{`${projectInfo?.token?.name}(${projectInfo?.token?.symbol})`}</div>
          </div>
        </div>
        {/* <div style={{ marginBottom: "8px" }}>
        <Heading size="h4">Progress {`(0.00%)`}</Heading>
        <Progress w="full" value={0} size="xs" />
      </div> */}
        <Divider sx={{ marginTop: "20px" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <IWCountDown launchpadData={launchpadData} saleTime={saleTime} />
          {/* <div>
          <IWStatusWithCountDown
            startDate={projectTime?.startTime}
            endDate={projectTime?.endTime}
          />
        </div> */}
          <Button width={"92px"} height={"42px"}>
            View
          </Button>
        </div>
      </Box>
    </FadeIn>
  );
};

export default LaunchpadTag;
