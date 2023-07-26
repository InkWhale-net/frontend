import {
  Box,
  Button,
  Divider,
  Heading,
  IconButton,
  Image,
  Progress,
} from "@chakra-ui/react";
import IWCountDown from "components/countdown/CountDown";
import { useEffect } from "react";
import { AiOutlineBell, AiOutlineHeart, AiOutlineLock } from "react-icons/ai";
import { getIPFSData } from "utils";

const LaunchpadTag = ({ LaunchpadData }) => {
  const { launchpadContract, launchpadInfo, projectInfoUri, tokenContract } =
    LaunchpadData;
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
          src={`${process.env.REACT_APP_IPFS_BASE_URL}/${launchpadInfo?.projectInfor?.headerImage}`}
        />
        <div
          style={{
            position: "absolute",
            right: "8px",
            top: "8px",
            background: "#E3DFF3",
            paddingTop: "4px",
            paddingBottom: "4px",
            paddingLeft: "12px",
            paddingRight: "12px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <AiOutlineLock style={{ marginRight: "8px" }} color="#57527E" />
          Upcoming
        </div>
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
            src={`${process.env.REACT_APP_IPFS_BASE_URL}/${launchpadInfo?.projectInfor?.avatarImage}`}
          />
        </div>
      </div>

      <div style={{ marginTop: "8px" }}>
        <Heading size="h3">{launchpadInfo?.projectInfor?.name}</Heading>
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
            src={`${process.env.REACT_APP_IPFS_BASE_URL}/${launchpadInfo?.token?.tokenIconUrl}`}
          />
          <div>{`${launchpadInfo?.token?.name}(${launchpadInfo?.token?.symbol})`}</div>
        </div>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <Heading size="h4">Progress {`(0.00%)`}</Heading>
        <Progress w="full" value={0} size="xs" />
      </div>
      <Divider />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
        }}
      >
        <div>
          {/* {launchpadInfo.projectInfor.startTime < new Date() ? (
            <div>Sale start in</div>
          ) : (
            <div>Sale end in</div>
          )} */}
          {/* <div>Sale start in</div> */}
          {/* <IWCountDown date={launchpadInfo.projectInfor.startTime} /> */}
        </div>
        <Button>View</Button>
      </div>
    </Box>
  );
};

export default LaunchpadTag;
