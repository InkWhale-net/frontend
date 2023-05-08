import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Spacer,
  Square,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useBreakpointValue,
  VStack,
  Im
} from "@chakra-ui/react";

import { ipfsClient } from "api/client";
import { Buffer } from "buffer";
// import { APICall } from "../../api/client";

const supportedFormat = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

export default function ImageUploadIcon({
  setImageIPFSUrl,
  isDisabled = false,
  iconUrl,
  limitedSize = { width: "50", height: "50" },
  setIsUploadIconIPFSUrl,
}) {
  const [imgURL, setImgURL] = useState(null);

  // const [newIconData, setNewIconData] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const avatarProfileSize = useBreakpointValue([260, 360]);
  const ref = useRef();

  const retrieveNewIcon = (e) => {
    let data;
    if (e) data = e.target.files[0];

    if (!supportedFormat.includes(data?.type)) {

      
      toast.error(
        `Please use .png .jpeg .jpeg, .gif format, the ${
          e.target?.files[0] && e.target.files[0].type.split("/")[1]
        } format is not supported.`
      );
      ref.current.value = null;
      // setNewIconData(null);
      setImagePreviewUrl("");
      return;
    }

    if (data?.size >= 5242880) {
      toast.error(
        `Maximum size support is 5MB, your image size is ${(
          data?.size / 1000000
        ).toFixed(2)}MB.`
      );
      ref.current.value = null;
      // setNewIconData(null);
      setImagePreviewUrl("");
      return;
    }

    setImgURL(null);

    const reader = new window.FileReader();

    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      // setNewIconData(Buffer(reader.result));

      const uploadPromise = () =>
        new Promise(function (resolve) {
          const created = ipfsClient.add(Buffer(reader.result));

          if (created) {
            resolve(created);
          }
        });

      toast.promise(
        uploadPromise().then(async (created) => {
          setImageIPFSUrl(created?.path);
          setImgURL(created?.path);
        }),
        {
          loading: "Uploading...",
          success: `Upload Icon successful!`,
          error: "Could not upload Icon.",
        }
      );
    };

    e.preventDefault();

    if (e.target.value !== "") {
      const src = URL.createObjectURL(e.target.files[0]);

      setImagePreviewUrl(src);
    }
  };

  return (
    <VStack h="full" justifyContent="flex-start" alignItems="start">
      <Box>
        {imagePreviewUrl && (
          <Square size={["130px", "180px"]}>
            <Image
              h="full"
              w="full"
              alt="avatar"
              boxShadow="base"
              objectFit="cover"
              objectPosition="center"
              src={imagePreviewUrl}
            />
          </Square>
        )}

        {!imagePreviewUrl && iconUrl && (
          <Square size={["130px", "180px"]}>
            {/* <Image
              h="full"
              w="full"
              alt="avatar"
              boxShadow="lg"
              objectFit="cover"
              objectPosition="center"
              src={getCachedImageShort(profile?.avatar, 500)}
            />{" "} */}
            <Image
              size={500}
              w={["130px", "180px"]}
              h={["130px", "180px"]}
              src={iconUrl}
            />
          </Square>
        )}

      </Box>

      <Center w="full" justifyContent="center">
        <VStack>
          <label htmlFor="inputTag" style={{ cursor: "pointer" }}>
            <input
              disabled={isDisabled}
              ref={ref}
              style={{ display: "none" }}
              id="inputTag"
              onChange={retrieveNewIcon}
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
            />
            <Button
              as={Text}
              isDisabled={isDisabled}
              fontFamily="Evogria"
              variant="outline"
              fontSize={["sm", "md"]}
              px={["16px", "32px"]}
            >
              {!imagePreviewUrl ? "Select image" : "Pick another"}
            </Button>
          </label>
        </VStack>
        <Spacer />

      </Center>
      <Text ml={2} fontSize="14px" color="brand.grayLight">
        Recommended file size is {limitedSize.width}x{limitedSize.height} px
      </Text>
    </VStack>
  );
}
