// src/components/Task.stories.js

import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {withKnobs, text, boolean, number} from "@storybook/addon-knobs";

import FHeader_1 from "./";

storiesOf("FHeader_1", module).add("primary", () => <FHeader_1 />);
