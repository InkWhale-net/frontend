import {
  Box,
  Heading,
  IconButton,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import ImageCloudFlare from "components/image-cf/ImageCF";
import ConfirmModal from "components/modal/ConfirmModal";
import { useState } from "react";
import { AiFillMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { Fragment } from "react-is";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedMultiStake } from "redux/slices/bulkStakeSlide";

const NFTCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { listNFTStake } = useSelector((s) => s.bulkStake);

  const { nftName, avatar, tokenID } = props?.cardData;
  const { action, actionHandler, unstakeFee } = props;

  const isSelected = listNFTStake
    .map((e) => e?.tokenID)
    ?.includes(props?.cardData?.tokenID);

  return (
    <Fragment>
      <WrapItem>
        <VStack
          spacing="12px"
          borderWidth="1px"
          borderRadius="10px"
          p={{ base: "10px", lg: "24px" }}
          w={{ base: "160px", sm: "170px", md: "270px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          border={
            isHovered || isSelected ? "4px solid #93F0F5" : "4px solid #FFF"
          }
        >
          {props?.disableBtn || (
            <IconButton
              position="absolute"
              alignSelf="flex-end"
              aria-label="select nft"
              variant="link"
              width={"42px"}
              height={"42px"}
              marginTop={"16px"}
              // variant={isSelected ? "solid" : "outline"}
              icon={
                isSelected ? (
                  <AiFillMinusSquare size={"42px"} color="#93F0F5" />
                ) : (
                  <AiOutlinePlusSquare size={"42px"} color="#93F0F5" />
                )
              }
              onClick={() =>
                dispatch(
                  updateSelectedMultiStake({
                    data: props?.cardData,
                    action: props.action,
                  })
                )
              }
            />
          )}
          <ImageCloudFlare
            borderWidth="1px"
            w={{ base: "none", lg: "222px" }}
            h={{ base: "none", lg: "222px" }}
            size="500"
            alt={nftName}
            borderRadius="5px"
            src={avatar}
          />
          <Heading
            w="full"
            as="h4"
            size="h4"
            mt="2px"
            textAlign="left"
            fontWeight="semibold"
            lineHeight={{ base: "20px", lg: "25px" }}
            fontSize={{ base: "16px", lg: "20px" }}
          >
            {nftName}
          </Heading>
          <Box
            display={{ base: "flex" }}
            justifyContent={{ base: "flex-start" }}
            w={{ base: "full" }}
          >
            <ConfirmModal
              disableBtn={props?.disableBtn}
              flex={1}
              action={action}
              buttonVariant="primary"
              buttonLabel={action}
              onClick={() => actionHandler(tokenID)}
              message={formatMessageNFTPool(action, nftName, unstakeFee)}
            />
          </Box>
        </VStack>
      </WrapItem>
    </Fragment>
  );
};

export default function IWCardNFTWrapper(props) {
  const { data, action, actionHandler, unstakeFee } = props;

  return (
    <>
      <Wrap spacing={{ base: "10px", md: "30px" }} w="full">
        {data?.map((cardData, idx) => {
          return (
            !!cardData && <NFTCard {...props} cardData={cardData} key={idx} />
          );
        })}
      </Wrap>
    </>
  );
}

const formatMessageNFTPool = (action, nftName, unstakeFee) => {
  if (action === "Stake NFT") {
    return (
      <>
        You are staking NFT {nftName}.<br />
        Unstaking later will cost you {Number(unstakeFee)?.toFixed(0)} INW V2.
        Continue?
      </>
    );
  }

  if (action === "Unstake NFT") {
    return (
      <>
        You are unstaking NFT {nftName}.<br />
        Unstaking will cost you {Number(unstakeFee)?.toFixed(0)} INW V2. Continue?
      </>
    );
  }
};
