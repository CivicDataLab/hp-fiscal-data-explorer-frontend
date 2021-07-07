import React, {useState} from "react";


const FilterIconFilled = (props) => {
  return (

      <svg
        width={32}
        height={32}
        viewBox="0 0 32 32"
        aria-hidden="true"
        style={{
          willChange: "transform"
        }}
        fill="#000"
        {...props}
      >
        <path d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2zM6 6v3.59l8" />
      </svg>

  );
}
export default FilterIconFilled;
