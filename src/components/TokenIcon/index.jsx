import { Image } from "@chakra-ui/react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function TokenIcon({tokenContract}) {
  const { allTokensList } = useSelector((s) => s.allPools);
  const tokenSelected = useMemo(() => {
    return allTokensList?.find(
      (token) => token?.contractAddress === tokenContract
    );
  }, [tokenContract, allTokensList]);
  return tokenSelected?.tokenIconUrl ? (
    <Image
      w="38px"
      mr="8px"
      borderRadius={"10px"}
      src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${tokenSelected["tokenIconUrl"]}`}
      alt="logo"
    />
  ) : (
    ""
  );
}
