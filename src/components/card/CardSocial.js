import { Flex, List, ListItem, Link } from "@chakra-ui/react";
import { DiscordIcon } from "components/icons/Icons";
import { TwitterIcon } from "components/icons/Icons";
import { TelegramIcon } from "components/icons/Icons";
import { WebsiteIcon } from "components/icons/Icons";
import React from "react";

function CardSocial({ websiteUrl, telegramUrl, twitterUrl, discordUrl }) {
  return (
    <List display="flex">
      <ListItem
        me={{
          base: "20px",
          md: "24px",
        }}
      >
        {websiteUrl ? (
          <Link
            isExternal
            fontWeight="400"
            color={"text.1"}
            _hover={{ color: "text.2" }}
            href={websiteUrl}
          >
            <Flex w="16px" h="24px">
              <WebsiteIcon />
            </Flex>
          </Link>
        ) : (
          <Flex w="16px" h="24px">
            <WebsiteIcon color="lightgrey" cursor="not-allowed" />
          </Flex>
        )}
      </ListItem>

      <ListItem
        me={{
          base: "20px",
          md: "24px",
        }}
      >
        {telegramUrl ? (
          <Link
            isExternal
            fontWeight="400"
            color={"text.1"}
            _hover={{ color: "text.2" }}
            href={telegramUrl}
          >
            <Flex w="16px" h="24px">
              <TelegramIcon />
            </Flex>
          </Link>
        ) : (
          <Flex w="16px" h="24px">
            <TelegramIcon color="lightgrey" cursor="not-allowed" />
          </Flex>
        )}
      </ListItem>

      <ListItem
        me={{
          base: "20px",
          md: "24px",
        }}
      >
        {discordUrl ? (
          <Link
            isExternal
            fontWeight="400"
            color={"text.1"}
            _hover={{ color: "text.2" }}
            href={discordUrl}
          >
            <Flex w="16px" h="24px">
              <DiscordIcon />
            </Flex>
          </Link>
        ) : (
          <Flex w="16px" h="24px">
            <DiscordIcon color="lightgrey" cursor="not-allowed" />
          </Flex>
        )}
      </ListItem>

      <ListItem>
        {twitterUrl ? (
          <Link
            isExternal
            fontWeight="400"
            color={"text.1"}
            _hover={{ color: "text.2" }}
            href={twitterUrl}
          >
            <Flex w="16px" h="24px">
              <TwitterIcon />
            </Flex>
          </Link>
        ) : (
          <Flex w="16px" h="24px">
            <TwitterIcon color="lightgrey" cursor="not-allowed" />
          </Flex>
        )}
      </ListItem>
    </List>
  );
}

export default CardSocial;
