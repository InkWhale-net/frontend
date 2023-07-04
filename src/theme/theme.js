import { extendTheme } from "@chakra-ui/react";

import { CardComponent } from "./additions/card/card";

import { buttonStyles } from "./components/button";
import { badgeStyles } from "./components/badge";
import { inputStyles } from "./components/input";
import { progressStyles } from "./components/progress";
import { sliderStyles } from "./components/slider";
import { textareaStyles } from "./components/textarea";
import { switchStyles } from "./components/switch";
import { linkStyles } from "./components/link";
import { headingStyles } from "./components/heading";

import { breakpoints } from "./foundations/breakpoints";
import { fonts } from "./foundations/fonts";
import { fontSizes } from "./foundations/fontSizes";

import { globalStyles } from "./styles";
import { tabsStyles } from "./components/tabs";
import { radioStyles } from "./components/Radio";

export default extendTheme(
  CardComponent, // card component

  buttonStyles, // button styles
  badgeStyles, // badge styles
  inputStyles, // input styles
  progressStyles, // progress styles
  sliderStyles, // slider styles
  textareaStyles, // textarea styles
  switchStyles, // switch styles
  linkStyles, // link styles
  headingStyles,
  tabsStyles,
  radioStyles,
  { breakpoints, fonts, fontSizes }, // Breakpoints

  globalStyles
);
