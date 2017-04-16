function inputSwitch(input){
    //input switch - performs actions corresponding to the keypad input
    switch(input){
        case '+':
            isOperandChosen = true;
            chosenOperand = '+';
            console.log("add");
            return false;
            break;
        case '-':
            isOperandChosen = true;
            chosenOperand = '-';
            console.log("sub")
            return false;
            break;
        case 'x':
            isOperandChosen = true;
            chosenOperand = 'x';
            console.log("mult");
            return false;
            break;
        case '/':
            isOperandChosen = true;
            chosenOperand = '/';
            console.log("div");
            return false;
            break;
        case '=':
            console.log("equal");
            return false;
            break;
        case '.':
            console.log("dot");
            //pushes a decimal dot to both input and display arrays if there isn't one already
            if(!hasDecimalDot(input)){
                pushToInputDisplay('.');
            }else{
                //this is so the character display count doesn't falsely increase
                return false;
            }
            break;
        default:
            //if an operand has been chosen, empty the display when entering the next "step" of the calculation
            if(isOperandChosen){
                clearDisplay();
            }
            //pushes integers to both input and display arrays
            isOperandChosen = false;
            pushToInputDisplay(input);
            console.log("num");
            console.log(isOperandChosen);
            return true;
            break;
    }
}
//short function to flush the display
function emptyDisplay(){
    $('.calc-display').empty()
}
//short function for appending to display
function appendToDisplay(input){
    $('.calc-display').append(input)
}
//short function for pushing to input array
function pushToInput(input){
    inputArray.push(input);
}
//short function for pushing to display array
function pushToDisplay(input){
    displayArray.push(input)
}
//calls both array push functions
function pushToInputDisplay(input){
    pushToInput(input);
    pushToDisplay(input);
}
//checks whether or not the decimal dot is included in the current inputarray
function hasDecimalDot(input){
    if(!inputArray.includes(input)){
        return false;
    }
    return true;
}
//checks the current number of display characters - deletes the first index of display numbers if numbers exceed display character limit
function checkDisplayCharacterNum(){
    currentNumbersOnDisplay++;
    if(currentNumbersOnDisplay > 11){
        displayArray.splice(0,1);
        currentNumbersOnDisplay=11;
    }
}
//clears the display and all associated arrays, as well as resetting current amount of numbers displayed
function clearDisplay(){
    currentNumbersOnDisplay = 0;
    inputArray = [];
    displayArray = [];
    emptyDisplay();
}

//math function - object containing multiple arithmetic functions
//doMath[operand](x,y);
let doMath = {
    '+':function(x,y){return x+y;},
    '-':function(x,y){return x-y;},
    '/':function(x,y){return x/y;},
    'x':function(x,y){return x*y;},
}

//array setup
let inputArray = [];            //stores keypad input data
let displayArray = [];          //stores display data
let operationArray = [];        //stores data for arithmetic operations

//checks whether or not an operand has been chosen
let isOperandChosen = false;
//sets the chosen operand
let chosenOperand = 0;

//keeps track of the current numbers on display
let currentNumbersOnDisplay = 0

$('.button').on('mousedown',function(){
    //grabs the value (0-9, arithmetic operands) from the button being clicked
    let input = $(this).attr('data-set');
    //stores true or false from the input switch - REQUIRED for only one decimal dot
    let switchResult = inputSwitch(input);

    //only checks and deletes display characters if switch returns true,
    //meaning there either decimal doesn't exist or wasn't pressed
    if(switchResult){checkDisplayCharacterNum();}
    //flushes the display before rendering new data
    emptyDisplay();
    appendToDisplay(displayArray);

    console.log(operationArray);
});

$('.clear').on('mousedown',function(){
    //clears both input and display array as well as flushes display
    clearDisplay();
});

$('.junq').on('click',function(){
    window.open('https://github.com/junkdeck/','_blank');
});
