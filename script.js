const DISPLAY_MAX_LENGTH = 11;

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
            operationArray.push(inputArray.join(''));
            //convert to function later, maybe?
            //goes through each entry in operationArray and evaluates the two parameters with the operator
            //should probably call this whenever the user inputs an additional operator after 2 numbers.
            //so if you input 2+2, then hit + again, it would evaluate 2+2 and print that to the display
            performOps(operationArray);
            operationArray = [];        //empty operations array so continuous evaluation doesn't just compound the current integers
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
        case '0':
        console.log("0");
        default:
            if(inputArray[0]==0){
                inputArray.splice(0,1);
            }
            //if an operand has been chosen, empty the display when entering the next "step" of the calculation
            if(isOperandChosen){
                operationArray.push(inputArray.join(''), chosenOperand);
                clearDisplay();
            //when you choose an operand, it pushes the current input data to the operation array. this also makes it so you can apply additional calculations to the result of the original evaluation
            }else if(isEvalDone&&!isOperandChosen){
                isEvalDone = false;
                clearDisplay();
            }
            //
            // else if(isEvalDone&&isOperandChosen){
            //     operationArray.push(inputArray.join(''), chosenOperand);
            //     clearDisplay();
            // }
            //removes leading zero from cleared display
            if(displayArray[0] == 0 && displayArray.length === 1){
                displayArray.splice(0,1);
            }
            //pushes integers to both input and display arrays
            isOperandChosen = false;
            pushToInputDisplay(input);
            console.log("input: "+inputArray);
            console.log("num");
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
    if(displayArray[0]==0){displayArray.splice(0,1);}
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
    if(inputArray[0] != 0){
        currentNumbersOnDisplay++;
    }
    if(currentNumbersOnDisplay > DISPLAY_MAX_LENGTH){
        displayArray.splice(0,1);
        currentNumbersOnDisplay=DISPLAY_MAX_LENGTH;
    }
}
//clears the display and all associated arrays, as well as resetting current amount of numbers displayed
function clearDisplay(){
    currentNumbersOnDisplay = 0;
    inputArray = [];
    displayArray = [0];
    emptyDisplay();
}
//performs the operations on the input numbers
function performOps(inArray){
    console.log("input: "+inputArray);
    console.log("display: "+displayArray);
    console.log("operation: "+operationArray);
    let a = 0;
    let b = 0;
    let op = '';
    inArray.forEach(function(x,i){
        //even index are nums, odd index are operators
        if(i%2!==0){    //even index, op
            op = x;
        }else if(i%2===0 && !a && !b){   //uneven index & unset a, num
            a = x;
        }else if(i%2===0 && !b){
            b = x;
        }
        if(a && b){
            console.log("a: "+a);
            console.log("b: "+b);
            let result = doMath[op](a,b);
            //if result is longer than 11 characters, chop off anything after 11
            if(result.toString().length > DISPLAY_MAX_LENGTH){
                //breaks the result into a string and removes all integers after display limit
                result = result.toString().split('').slice(0,DISPLAY_MAX_LENGTH);//.join('');
                //increments the last number in result if there's a decimal somewhere
                if(result.includes('.')){
                    console.log("result: "+result);
                    //gets the last integer of the result and increments it
                    let lastInt = result[DISPLAY_MAX_LENGTH-1];
                    lastInt++;
                    //removes the last integer of the result and pushes in the newly rounded integer
                    result.splice(DISPLAY_MAX_LENGTH-1,1);
                    result.push(lastInt);
                }
                //turns the result back into a float
                result = parseFloat(result.join(''));
            }
            console.log("result: "+result);
            console.log("result length: "+result.toString().length);
            clearDisplay();
            pushToInputDisplay(result);
            isEvalDone = true;
        }
    });
}

//math function - object containing multiple arithmetic functions
//doMath[operand](x,y);
let doMath = {
    '+':function(x,y){return parseFloat(x)+parseFloat(y);},
    '-':function(x,y){return parseFloat(x)-parseFloat(y);},
    '/':function(x,y){
        if(x==0||y==0){
            return "DIVISION BY 0";
        }
        return parseFloat(x)/parseFloat(y);},
    'x':function(x,y){return parseFloat(x)*parseFloat(y);},
}

//array setup
let inputArray = [];            //stores keypad input data
let displayArray = [0];          //stores display data
let operationArray = [];        //stores data for arithmetic operations

//checks whether or not evaluation is complete
let isEvalDone = false;

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

    //only checks and deletes display characters if switch returns true
    //any decimals after 1, and all operators returns false
    if(switchResult){checkDisplayCharacterNum();}

    //calculates the current inputs in operationArray if an operand has been pressed AND if there's already 2 inputs
    if(operationArray.length >= 2  && isOperandChosen){
        operationArray.push(inputArray);
        performOps(operationArray);
        operationArray = [];
    }

    //flushes the display before rendering new data
    emptyDisplay();
    appendToDisplay(displayArray);
});

$('.clear').on('mousedown',function(){
    //clears both input and display array as well as flushes display
    operationArray = [];
    clearDisplay();
    appendToDisplay(displayArray);
});

$('.junq').on('click',function(){
    window.open('https://github.com/junkdeck/','_blank');
});

appendToDisplay(0);
