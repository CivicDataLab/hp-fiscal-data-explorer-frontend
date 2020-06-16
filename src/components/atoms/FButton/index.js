import React, {Component} from "react";
import { Button } from "carbon-components-react";

export default function FButton(props) {
  return (
    <Button
      onClick={props.onClick}
      className='f-button'
      >
      {props.children}
    </Button>
  )
}
