import React from "react";
import Countdown, { zeroPad } from "react-countdown";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const SaleCount = ({ label, time }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <></>;
    } else {
      return (
        <Flex>
          <Text sx={{ fontWeight: "bold", color: "#57527E" }}>{`${
            days && zeroPad(days)
          }d:${zeroPad(hours)}h:${zeroPad(minutes)}m:${zeroPad(
            seconds
          )}s`}</Text>
        </Flex>
      );
    }
  };
  return (
    <Box>
      <Text>{label}</Text>
      {time ? (
        <Countdown date={time} renderer={renderer} />
      ) : (
        <Text sx={{ fontWeight: "bold", color: "#57527E" }}>00:00:00:00</Text>
      )}
    </Box>
  );
};

export const IWStatusWithCountDown = ({ startDate, endDate }) => {
  const renderer = ({ completed }) => {
    const now = Date.now();
    if (completed) {
      return <SaleCount label="Sale ended!" />;
    } else if (now < startDate) {
      return <SaleCount label="Sale start in" time={startDate} />;
    } else if (now >= startDate && now < endDate) {
      return <SaleCount label="Sale end in" time={endDate} />;
    } else return null;
  };
  if (startDate && endDate)
    return <Countdown date={endDate} renderer={renderer} />;
  else return <div>no time</div>;
};

export const IWStatus = ({
  startDate,
  endDate,
  upcomingRender,
  liveRender,
  endRender,
}) => {
  const renderer = ({ completed }) => {
    const now = Date.now();
    if (completed) {
      return endRender;
    } else if (now < startDate) {
      return upcomingRender;
    } else if (now >= startDate && now < endDate) {
      return liveRender;
    } else return null;
  };
  if (startDate && endDate)
    return <Countdown date={endDate} renderer={renderer} />;
  else return <div>no time</div>;
};
