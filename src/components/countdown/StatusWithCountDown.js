import Countdown, { zeroPad } from "react-countdown";

import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { AiOutlineLock } from "react-icons/ai";
import { BsDot } from "react-icons/bs";

const SaleCount = ({ label, time, direction }) => {
  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
  };
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <></>;
    } else {
      return (
        <Flex>
          <Text>{`${days && zeroPad(days)}d:${zeroPad(hours)}h:${zeroPad(
            minutes
          )}m:${zeroPad(seconds)}s`}</Text>
        </Flex>
      );
    }
  };
  return (
    <Box sx={direction == "row" && rowStyle}>
      <Text>{label}</Text>
      {time ? (
        <Countdown date={time} renderer={renderer} />
      ) : (
        <Text sx={{ fontWeight: "bold", color: "#57527E" }}>00:00:00:00</Text>
      )}
    </Box>
  );
};

export const IWStatusWithCountDown = ({ startDate, endDate, direction }) => {
  const renderer = ({ completed }) => {
    const now = Date.now();
    if (completed) {
      return <SaleCount label="Ended" direction={direction} />;
    } else if (now < startDate) {
      return (
        <SaleCount
          label="Sale starts in"
          time={startDate}
          direction={direction}
        />
      );
    } else if (now >= startDate && now < endDate) {
      return (
        <SaleCount label="Sale end in" time={endDate} direction={direction} />
      );
    } else return null;
  };
  if (startDate && endDate)
    return <Countdown date={endDate} renderer={renderer} />;
  else return <div>no time</div>;
};

export const UpcomingTag = ({ label }) => {
  return (
    <div
      style={{
        background: "#E3DFF3",
        paddingLeft: "8px",
        paddingRight: "12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#57527E",
      }}
    >
      <AiOutlineLock style={{ marginRight: "4px" }} color="#57527E" />
      {label}
    </div>
  );
};

export const LiveTag = ({ label }) => {
  return (
    <div
      style={{
        background: "#E1FFD6",
        paddingLeft: "8px",
        paddingRight: "12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#57527E",
      }}
    >
      <BsDot size={"20px"} color="#9CDE85" />
      {label}
    </div>
  );
};
export const EndTag = ({ label }) => {
  return (
    <div
      style={{
        background: "#FFE1E1",
        paddingLeft: "8px",
        paddingRight: "12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#57527E",
      }}
    >
      <BsDot size={"20px"} color="#FF9595" />
      {label}
    </div>
  );
};

export const NotActive = ({ label }) => {
  return (
    <Tooltip label="Contact InkWhale to active project">
      <div
        style={{
          position: "absolute",
          right: "8px",
          top: "8px",
          background: "#E3DFF3",
          paddingLeft: "8px",
          paddingRight: "12px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "14px",
          color: "#57527E",
        }}
      >
        <BsDot size={"20px"} color="#FF9595" />
        Not Active
      </div>
    </Tooltip>
  );
};

export const IWStatus = ({
  startDate,
  endDate,
  upcomingRender,
  liveRender,
  endRender,
  label,
  isActive,
}) => {
  const renderer = ({ completed }) => {
    if (!isActive) {
      return <NotActive />;
    }
    const now = Date.now();
    if (completed) {
      return endRender || <EndTag label={label?.end} />;
    } else if (now < startDate) {
      return upcomingRender || <UpcomingTag label={label?.upcoming} />;
    } else if (now >= startDate && now < endDate) {
      return liveRender || <LiveTag label={label?.live} />;
    } else return null;
  };
  if (startDate && endDate)
    return <Countdown date={endDate} renderer={renderer} />;
  else return <div>no time</div>;
};
