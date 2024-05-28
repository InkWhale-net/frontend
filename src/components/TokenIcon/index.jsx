import { Image } from "@chakra-ui/react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import IconQuestionMark from "assets/img/question-mark.png";

export default function TokenIcon({ tokenContract }) {
  const { allTokensList } = useSelector((s) => s.allPools);

  const tokenSelected = useMemo(() => {
    return allTokensList?.find(
      (token) => token?.contractAddress === tokenContract
    );
  }, [tokenContract, allTokensList]);

  return tokenSelected?.tokenIconUrl ? (
    <Image
      w="42px"
      h="38px"
      objectFit="cover"
      mr="8px"
      borderRadius={"10px"}
      src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${tokenSelected["tokenIconUrl"]}`}
      alt="logo"
    />
  ) : (
    <Image
      src={IconQuestionMark}
      w="42px"
      h="38px"
      borderRadius={"10px"}
      alt="logo"
    />
  );
}
