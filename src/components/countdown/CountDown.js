import React from "react";
import Countdown, { zeroPad } from "react-countdown";

import { Flex, Text } from "@chakra-ui/react";

export default function IWCountDown({ date }) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <>{`--:--:--`}</>;
    } else {
      return (
        <Flex>
          {days ? (
            <Text textAlign="left" mr={days > 99 ? "2" : ""} minW={"42px"}>
              {zeroPad(days)}d
            </Text>
          ) : (
            ""
          )}
          <Text textAlign="left" minW="40px">
            {`${zeroPad(hours)}h ${zeroPad(minutes)}m ${zeroPad(seconds)}s`}
          </Text>
        </Flex>
      );
    }
  };
  return (
    <span>
      <Countdown key={date?.toString()} date={date} renderer={renderer} />
    </span>
  );
}
