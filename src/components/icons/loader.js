import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>MonoSlate Logo</title>
    <g transform="translate(0, 0)">
      <path
        d="M50 5L89 27V72L50 95L11 73V28L50 5Z"
        fill="none"
        stroke="#000"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#000"
        fontSize="50"
        fontWeight="bold"
        fontFamily="Helvetica Neue', Arial, sans-serif">
        S
      </text>

      {/* For Adding More text under "S" */}
      {/* <text 
        x="50%" 
        y="75%" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill="#000" 
        fontSize="16" 
        fontFamily="Helvetica Neue', Arial, sans-serif"
      >
        -Dev-
      </text> */}
    </g>
  </svg>
);

export default IconLoader;
