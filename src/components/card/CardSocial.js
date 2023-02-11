import { Box, List, ListItem, Link } from "@chakra-ui/react";
import { DiscordIcon } from "components/icons/Icons";
import { TwitterIcon } from "components/icons/Icons";
import { TelegramIcon } from "components/icons/Icons";
import React from "react";

function CardSocial({ telegramUrl, twitterUrl, discordUrl }) {
  return (
    <List display="flex">
      <ListItem
        me={{
          base: "20px",
          md: "24px",
        }}
      >
        <Link
          isExternal
          fontWeight="400"
          color={"text.1"}
          _hover={{ color: "text.2" }}
          href={telegramUrl}
        >
          <Box w="16px" h="24px">
            <TelegramIcon />
          </Box>
        </Link>
      </ListItem>
      <ListItem
        me={{
          base: "20px",
          md: "24px",
        }}
      >
        <Link
          isExternal
          fontWeight="400"
          color={"text.1"}
          _hover={{ color: "text.2" }}
          href={discordUrl}
        >
          <Box w="16px" h="24px">
            <DiscordIcon />
          </Box>
        </Link>
      </ListItem>
      <ListItem>
        <Link
          isExternal
          fontWeight="400"
          color={"text.1"}
          _hover={{ color: "text.2" }}
          href={twitterUrl}
        >
          <Box w="16px" h="24px">
            <TwitterIcon />
          </Box>
        </Link>
      </ListItem>
    </List>
  );
}

export default CardSocial;
