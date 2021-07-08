// src/components/Task.stories.js

import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {withKnobs, text, boolean, number} from "@storybook/addon-knobs";

import FButton from "./";

storiesOf("FButton", module).add("primary", () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      padding: "3em"
    }}
  >
    <FButton />
  </div>
));
