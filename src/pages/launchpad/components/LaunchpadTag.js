import {
  Box,
  Button,
  Divider,
  Heading,
  Image,
  Progress,
} from "@chakra-ui/react";
import {
  IWStatus,
  IWStatusWithCountDown,
} from "components/countdown/StatusWithCountDown";
import { useHistory } from "react-router-dom";
import { EndStatusTag, LiveStatusTag, UpcomingStatusTag } from "./StatusTag";
import { useMemo } from "react";

const LaunchpadTag = ({ LaunchpadData }) => {
  const history = useHistory();
  const { launchpadContract, projectInfo } = LaunchpadData;
  const { projectInfor } = projectInfo || {};

  const projectTime = useMemo(() => {
    return {
      startTime: new Date(
        parseInt(LaunchpadData?.startTime?.replace(/,/g, ""))
      ),
      endTime: new Date(parseInt(LaunchpadData?.endTime?.replace(/,/g, ""))),
    };
  }, [LaunchpadData]);

  return (
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
        transition: "border 300ms ease-in-out",
      }}
      onClick={() => {
        history.push({
          state: LaunchpadData,
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
          marginTop: "8px",
        }}
      >
        <div>
          <IWStatusWithCountDown
            startDate={projectTime?.startTime}
            endDate={projectTime?.endTime}
          />
        </div>
        <Button>View</Button>
      </div>
    </Box>
  );
};

export default LaunchpadTag;
