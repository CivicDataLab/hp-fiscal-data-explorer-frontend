import React, {Component} from "react";
import {Loading} from "carbon-components-react";

export default function FLoading(props) {
  return (
      <Loading
        active
        className="f-loading-gif"
        description="Active loading indicator"
        small={false}
        withOverlay={false}
      />
  );
}
