import "./styles.css";
//import DisplayResults from "@3d-dice/dice-ui/src/displayResults"; // fui index exports are messed up -> going to src
import DiceParser from "@3d-dice/dice-parser-interface";
import { Dice } from "./diceBox";


// create Dice Roll Parser to handle complex notations
const DRP = new DiceParser();

// create display overlay for final results
//const DiceResults = new DisplayResults("#dice-box");

// initialize the Dice Box outside of the component
Dice.init().then(() => {
  

});

export default function DiceRoller(props) {
  // This method is triggered whenever dice are finished rolling
 
 
  // clear dice on click anywhere on the screen
  Dice.onRollComplete = (results) => {
    document.addEventListener("mousedown", () => {
      const diceBoxCanvas = document.getElementById("dice-canvas");
      if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
        Dice.hide().clear();
        //DiceResults.clear();
      }
    });

    // handle any rerolls
    const rerolls = DRP.handleRerolls(results);
    if (rerolls.length) {
      rerolls.forEach((roll) => Dice.add(roll, roll.groupId));
      return rerolls;
    }
    // if no rerolls needed then parse the final results
    const finalResults = DRP.parseFinalResults(results);
    // show the results

    props.onLanzar(props.panelLanzar,finalResults)
   // DiceResults.showResults(finalResults);
  };

  // trigger dice roll
  const rollDice = (notation, group) => {
    // trigger the dice roll using the parser
    let a={ theme:"default", themeColor: props.color, newStartPoint:true}
    Dice.show().roll(DRP.parseNotation(notation),a);

    
    
    props.onResultado(Dice)
  };
  
 rollDice(props.tirada)
        
    
}

