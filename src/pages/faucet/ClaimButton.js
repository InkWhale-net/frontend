import Countdown, { zeroPad } from "react-countdown";

import { Button, Text } from "@chakra-ui/react";

const NextClaimCountdown = ({ endDate, disabled }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return null;
    } else {
      return (
        <Text>
          {disabled
            ? `Next claim time ${`${zeroPad(hours)}h${zeroPad(
                minutes
              )}m${zeroPad(seconds)}s`}`
            : "Claim INW"}
        </Text>
      );
    }
  };
  return (
    <span>
      <Countdown key={endDate?.toString()} date={endDate} renderer={renderer} />
    </span>
  );
};

export default function IWCountDownClaim({ endDate, onClick, disabled }) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    const currentDate = new Date();
    const claimTimeToday = new Date();
    claimTimeToday.setHours(10, 23, 0, 0);
    const nextClaimTime =
      currentDate > claimTimeToday
        ? claimTimeToday.setDate(claimTimeToday.getDate() + 1)
        : claimTimeToday;
    if (completed) {
      return (
        <Button w="full" mt="20px" disabled>
          Claim INW Ended
        </Button>
      );
    } else {
      return (
        <Button w="full" mt="20px" disabled={disabled} onClick={onClick}>
          <NextClaimCountdown endDate={nextClaimTime} disabled={disabled} />
        </Button>
      );
    }
  };
  return (
    <span>
      <Countdown key={endDate?.toString()} date={endDate} renderer={renderer} />
    </span>
  );
}
