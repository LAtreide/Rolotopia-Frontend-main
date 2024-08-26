import DiceBox from "@3d-dice/dice-box";

/*  --------------- DICE BOX -------------- */
// Note the dice-box assets in the public folder.
// Those files are all necessary for the web workers to function properly
// create new DiceBox class
const Dice = new DiceBox(
  "#dice-box", // target DOM element to inject the canvas for rendering
  {
    id: "dice-canvas", // canvas element id
    assetPath: "/assets/dice-box/",
    startingHeight: 8,
    throwForce: 6,
    spinForce: 5,
    lightIntensity: 0.9,
    themeColor: "#852e2e",
    shadowTransparency:0,
    offScrean:false,
    scale: 5,


/*
  enableShadows: true,
  shadowTransparency: 0.8,
  lightIntensity: 1,
  delay: 10,
  scale: 5,
  theme: "default",
  themeColor: "#2e8555",
  offscreen: true,
  assetPath: "/assets/dice-box/",
  origin: location.origin,
  meshFile: `models/default.json`,
  suspendSimulation: false
  */

  }
);

export { Dice };
