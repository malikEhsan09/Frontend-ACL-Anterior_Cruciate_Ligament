'use client'

import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div id="wifi-loader">
        <svg viewBox="0 0 86 86" className="circle-outer">
          <circle r={40} cy={43} cx={43} className="back" />
          <circle r={40} cy={43} cx={43} className="front" />
          <circle r={40} cy={43} cx={43} className="new" />
        </svg>
        <svg viewBox="0 0 60 60" className="circle-middle">
          <circle r={27} cy={30} cx={30} className="back" />
          <circle r={27} cy={30} cx={30} className="front" />
        </svg>
        <svg viewBox="0 0 34 34" className="circle-inner">
          <circle r={14} cy={17} cx={17} className="back" />
          <circle r={14} cy={17} cx={17} className="front" />
        </svg>
        <div data-text="Searching" className="text" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  #wifi-loader {
    --background: #62abff;
    --front-color: #000;
    --back-color: #c3c8de;
    --text-color: #414856;
    width: 200px; /* Increased size */
    height: 200px; /* Increased size */
    border-radius: 50px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #wifi-loader svg {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #wifi-loader svg circle {
    position: absolute;
    fill: none;
    stroke-width: 6px;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: rotate(-100deg);
    transform-origin: center;
  }

  #wifi-loader svg circle.back {
    stroke: var(--back-color);
  }

  #wifi-loader svg circle.front {
    stroke: var(--front-color);
  }

  #wifi-loader svg.circle-outer {
    height: 200px; /* Increased size */
    width: 200px; /* Increased size */
  }

  #wifi-loader svg.circle-outer circle {
    stroke-dasharray: 62.75 188.25;
  }

  #wifi-loader svg.circle-outer circle.back {
    animation: circle-outer135 1.8s ease infinite 0.3s;
  }

  #wifi-loader svg.circle-outer circle.front {
    animation: circle-outer135 1.8s ease infinite 0.15s;
  }

  #wifi-loader svg.circle-middle {
    height: 140px; /* Increased size */
    width: 140px; /* Increased size */
  }

  #wifi-loader svg.circle-middle circle {
    stroke-dasharray: 42.5 127.5;
  }

  #wifi-loader svg.circle-middle circle.back {
    animation: circle-middle6123 1.8s ease infinite 0.25s;
  }

  #wifi-loader svg.circle-middle circle.front {
    animation: circle-middle6123 1.8s ease infinite 0.1s;
  }

  #wifi-loader svg.circle-inner {
    height: 100px; /* Increased size */
    width: 100px; /* Increased size */
  }

  #wifi-loader svg.circle-inner circle {
    stroke-dasharray: 22 66;
  }

  #wifi-loader svg.circle-inner circle.back {
    animation: circle-inner162 1.8s ease infinite 0.2s;
  }

  #wifi-loader svg.circle-inner circle.front {
    animation: circle-inner162 1.8s ease infinite 0.05s;
  } 

  #wifi-loader .text {
    // position: absolute;
    bottom: -90px; /* Adjusted position */
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: lowercase;
    font-weight: 500;
    font-size: 24px; /* Increased size */
    letter-spacing: 0.2px;
  }

  #wifi-loader .text::before,
  #wifi-loader .text::after {
    content: attr(data-text);
  }

  #wifi-loader .text::before {
    color: var(--text-color);
  }

  #wifi-loader .text::after {
    color: var(--front-color);
    animation: text-animation76 3.6s ease infinite;
    position: absolute;
    left: 0;
  }

  @keyframes circle-outer135 {
    0% {
      stroke-dashoffset: 25;
    }

    25% {
      stroke-dashoffset: 0;
    }

    65% {
      stroke-dashoffset: 301;
    }

    80% {
      stroke-dashoffset: 276;
    }

    100% {
      stroke-dashoffset: 276;
    }
  }

  @keyframes circle-middle6123 {
    0% {
      stroke-dashoffset: 17;
    }

    25% {
      stroke-dashoffset: 0;
    }

    65% {
      stroke-dashoffset: 204;
    }

    80% {
      stroke-dashoffset: 187;
    }

    100% {
      stroke-dashoffset: 187;
    }
  }

  @keyframes circle-inner162 {
    0% {
      stroke-dashoffset: 9;
    }

    25% {
      stroke-dashoffset: 0;
    }

    65% {
      stroke-dashoffset: 106;
    }

    80% {
      stroke-dashoffset: 97;
    }

    100% {
      stroke-dashoffset: 97;
    }
  }

  @keyframes text-animation76 {
    0% {
      clip-path: inset(0 100% 0 0);
    }

    50% {
      clip-path: inset(0);
    }

    100% {
      clip-path: inset(0 0 0 100%);
    }
  }
`;

export default Loader;
