var procedure = { 
"INIT": initialProcess, 
"TOPDIGIT": determineTopDigit,
"SUBSQUARE": subtractSquare,
"DIVBY2": divideBy2,
"HASSAN": hassan,
"CHEATCHECK": cheatCheck,
"MULSUB": multiplyAndSubtract,
"HALFSQUARESUB": halfSquareSubtract,
"FINISHED": finished,
};

function finished() {
  return "FINISHED";
}

function halfSquareSubtract() {
  var digit = getPartialNumber(resultPointer, 1);
  var temp =  getPartialNumber(resultPointer+1, resultPointer+2);     // 2 digit + 1 digit (fraction part)
  temp -= (digit * digit) * 5;
  puts("Subtract one-half of square of " + rulerRangeWithValue(resultPointer, resultPointer) + " which is " + (digit * digit / 2.0) + " from " + rulerRange(resultPointer+1, valuePointer+1) + "." + rulerRange(valuePointer+2, valuePointer+2) + ".");
  putNumber(temp, resultPointer+1, resultPointer+2);
  outputPanel();
  if (getPartialNumber(resultPointer+1, workArray.length-resultPointer-1) == 0) {
    puts("FINISHED");
    return "FINISHED";
  } else {
    valuePointer = resultPointer + 1;
    puts("End of Phase V... continue to Phase IV.");
    puts("Phase IV:: Now, determine " + nth(resultPointer+2) + " digit (from left) of the result.");
    return "HASSAN";
  }
}

function multiplyAndSubtract() {
  if (divisorPointer >= resultPointer) {
    puts("End of Phase IV...continue to Phase V.");
    puts("Phase V:: Subtract one-half of the square.");
    return "HALFSQUARESUB";
  }
  var currentResult = getPartialNumber(resultPointer, 1);
  var a = getPartialNumber(divisorPointer, 1);
  puts("  Subtract the result of " + rulerRange(resultPointer, resultPointer) + "*" + rulerRange(divisorPointer, divisorPointer) + " from " + rulerRange(resultPointer+1, valuePointer+1));
  a = a * currentResult;
  putNumber(getPartialNumber(resultPointer+1, valuePointer-resultPointer+1) - a, resultPointer+1, valuePointer-resultPointer+1);
  outputPanel();
  valuePointer++;
  divisorPointer++;
  return "MULSUB";
}

function cheatCheck() {
  var processDigit = resultPointer - 1;
  var currentResult = getPartialNumber(resultPointer, 1);
  var sum = 0;
  var ll = resultPointer - 1;
  sum = getPartialNumber(1, ll) * currentResult * 100 + (currentResult * currentResult * 5);
  if (sum > getPartialNumber(resultPointer+1, processDigit+3)) {
    puts("  Temporary result is too big, decrement ONE from " + rulerRangeWithValue(resultPointer, resultPointer) + " and add " + english[getPartialNumber(0, 1)] + " to the right rod.");
    putNumber(getPartialNumber(resultPointer, 1) - 1, resultPointer, 1);
    putNumber(getPartialNumber(resultPointer+1, 1) + getPartialNumber(0, 1), resultPointer + 1, 1);
    outputPanel();
    return "CHEATCHECK";
  }
  puts("Could be divided, so proceed...");
  return "MULSUB";
}

var resultPointer;
var divisorPointer;
function hassan() {
  var hou = getPartialNumber(0, 1);
  var jitsu = getPartialNumber(valuePointer, 1);
  if (hou > jitsu) {
    var wrg1 = Math.trunc((jitsu * 10) / hou)
    var wrg2 = (jitsu * 10) % hou
    if (wrg1 != 0) {
      put("Looking at (" + rulerRange(0, 0) + " &) " + rulerRange(valuePointer, valuePointer) + " : " + english[getPartialNumber(0, 1)] + " " + english[getPartialNumber(valuePointer, 1)] + ",");
      if (wrg1 != jitsu) {
        put(" becomes " + english[wrg1]);
        if (wrg2 != 0) {
          put(" and ");
        }
      }
      if (wrg2 != 0) {
        put(" add " + english[wrg2] + " to the right.");
      }
      puts("");
      workArray[valuePointer] = wrg1;
      workArray[valuePointer + 1] += wrg2;
      outputPanel();
    }
    var ctr = 0;
    while (getPartialNumber(valuePointer + 1, 1) >= hou) {
      workArray[valuePointer + 1]  -= hou;
      workArray[valuePointer]++;
      ctr++;
    }
    if (ctr > 0) {
      puts("Looking at (" + rulerRange(0, 0) + " & " + rulerRange(valuePointer+1, valuePointer+1) + ") : subtract " + english[ctr * hou] + " from " + rulerRange(valuePointer+1, valuePointer+1) + " and add " + english[ctr] + " to " + rulerRange(valuePointer, valuePointer) + ".");
      outputPanel();
    }
  } else {
    workArray[valuePointer] = 9;
    workArray[valuePointer + 1] += hou;
    puts("Ken 1 mutou");
    outputPanel();
  }
  resultPointer = valuePointer;
  valuePointer++;
  divisorPointer = 1;
  return "CHEATCHECK";
}

var valuePointer;
function divideBy2() {
  var processed = false;
  var left = 0;
  puts("  Processing rod " + rulerRange(valuePointer, valuePointer));
  while (workArray[valuePointer] >= 2) {
    left++;
    workArray[valuePointer-1]++;
    workArray[valuePointer] -= 2;
  }
  if (left > 0) {
    puts("    Looking at " + ruler[valuePointer] + "... subtract " + english[left * 2] + " from " + ruler[valuePointer] + " and add " + english[left] + " to " + ruler[valuePointer-1] + ".");
    processed = true;
  }
  if (workArray[valuePointer] == 1) {
    puts("    Looking at "  + ruler[valuePointer] + "...TWO ONE becomes FIVE.");
    workArray[valuePointer] = 5;
    processed = true;
  }
  var counter = 0;
  while (workArray[valuePointer+1] >= 2) {
    counter++;
    workArray[valuePointer]++;
    workArray[valuePointer+1] -= 2;
  }
  if (counter > 0) {
    puts("    Looking at " + ruler[valuePointer+1] + "... subtract " + english[counter * 2] + " from " + ruler[valuePointer+1] + " and add " + english[counter] + " to " + ruler[valuePointer] + ".");
    processed = true;
  }
  if (processed == false) {
   puts("    This digit is empty, so no operations...");
  }
  outputPanel();
  if (valuePointer < workArray.length-1) {
    valuePointer++;
    return "DIVBY2";
  } else {
    puts("End of Phase III...continue to Phase IV.");
    resultPointer = 0;
    valuePointer = 1;
    puts("Phase IV:: Now, determine " + nth(resultPointer+2) + " digit (from left) of the result.");
    return "HASSAN";
  }
}

function subtractSquare() {
  var top = getPartialNumber(0, 1);
  var val = getPartialNumber(1, 2);
  val -= (top * top);
  puts("Subtract square of " + rulerRangeWithValue(0, 0) + " which is " + (top*top) + " from " + rulerRangeWithValue(1, 2) + " and place it in " + rulerRange(1,2) + ".");
  putNumber(val, 1, 2);
  outputPanel();
  valuePointer = 1;
  if (getPartialNumber(1, workArray.length-1) == 0) {
    puts("FINISHED");
    return "FINISHED";
  } else {
    puts("Phase III:: Now we are going to divide " + rulerRangeWithValue(1, workArray.length-1) + " by 2 (by using Kijo-ho aka Chinese division table).");
    return "DIVBY2";
  }
}

function determineTopDigit() {
  var num = getPartialNumber(1, 2);
  var tmp = 9;
  while (tmp*tmp > num)  tmp--;
  puts("Phase II:: The perfect square number that doesn't exceed the " + rulerRangeWithValue(p, p+1) + ", is " + tmp + ", so put it to " + ruler[rp] + ".");
  workArray[rp] = tmp;
  outputPanel();
  return "SUBSQUARE";
}

function initialProcess() {
  var inputValue = document.getElementById("expression").value;
  // Input check
  if (inputValue.match(/^\d*(\.\d+)?$/) == null) {
    alert("Illegal Input");
    document.getElementById("expression").value = "";
    puts("error...");
    stepCounter = 1;
    return "INIT";
  }
  // Grouping 2 digits each
  inputValue = String(Number(inputValue));  // regularize (eliminate left zeros)
  var dp = inputValue.indexOf(".");
  if (dp == -1) {       // it's an integer
    inputValue = ((inputValue.length % 2) == 1) ? "0" + inputValue : inputValue;
  } else {              // it's a fraction number
    if (inputValue.indexOf("0.") == 0) {
      inputValue = inputValue.slice(2);
    } else {
      inputValue  = ((dp % 2) == 1) ? "0" + inputValue : inputValue;
      inputValue  = inputValue.replace(/\./, "");
    }
  }
  puts("Phase I:: Separate the value 2 digits each mentally, and place them from [B]. ([A] is reserved for the answer's top digit.)");
  if (inputValue.substring(0, 1) === "0") {     // Place number to array
    puts("  Put value " + inputValue.slice(1) + " from [C] to " + ruler[inputValue.length] + ".");
  } else {
    puts("  Put value " + inputValue + " from [B] to " + ruler[inputValue.length] + ".");
  }
  workArray = num2array("0" + inputValue);  // append digit for answer
  outputPanel();
  return "TOPDIGIT";
}

// 
// Framework
// 
// HTML should define textArea with ID: 'displayArea', and call main() to start the process.
// Tutorial JavaScript file should define each functions and flow control as "procedure."

var stagePointer = "INIT";

var workArray;
var ruler = ["[A]", "[B]", "[C]", "[D]", "[E]", "[F]", "[G]", "[H]", "[I]", "[J]", "[K]", "[L]", "[M]", "[N]", "[O]", "[P]", "[Q]", "[R]", "[S]", "[T]", "[U]", "[V]", "[W]", "[X]", "[Y]", "[Z]", ];
var rp = 0;
var wrp = 0;
var xrp = 0;
var p = 1;
var english = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
var stepCounter=1;

function main() {   // Main loop
  put("STEP " + stepCounter + ": ");
  stepCounter++;
  stagePointer = procedure[stagePointer]();
}

function nth(n) {
  return n + (["st","nd","rd"][((n+90)%100-10)%10-1]||"th");
}

function puts(content) {    // display to textArea with CR
  put(content + "\n");
}

function put(content) {     // display to textArea without CR
  var displayArea = document.getElementById("displayArea");
  displayArea.value += content;
  displayArea.scrollTop = displayArea.scrollHeight;
}

function num2array(val) {       // just put digits to an array
  var result = val.split("");
  for (i = 0; i < result.length; i++) {
    result[i] = Number(result[i]);
  }
  return result;
}

function putNumber(value, position, length) {
  while(workArray.length < position+length) {
    workArray.push(0);
  }
  value = Number(value);
  while(length > 1) {
    var num = value % 10;
    workArray[position+length-1] = num;
    value = Math.trunc(value / 10);
    length--;
  }
  workArray[position] = value;
}
function getPartialNumber(start, length) {      // get partial number
  var extra = start + length - workArray.length;
  while (extra > 0) {
    workArray.push(0);
    extra--;
  }
  var result = 0;
  for (i = start; i < start+length; i++) {
    result *= 10;
    result += workArray[i];
  }
  return result;
}

function rulerRange(start, end) {
  if (start == end)
    return ruler[start];
  else
    return ruler[start] + "-" + ruler[end];
}

function rulerRangeWithValue(start, end) {
  if (start == end)
    return ruler[start] + " (" + getPartialNumber(start, 1) + ")";
  else
    return rulerRange(start, end) + " (" + getPartialNumber(start, end-start+1) + ")";
}

function outputPanel() {        // display entire image
  var str = "";
  var hdr = "";
  var spacer = " ".repeat(10);
  for (i=0; i<workArray.length; i++) {
    str += "[" + workArray[i] + "] ";
    hdr += ruler[i] + " ";
  }
//  puts(spacer + "-".repeat(hdr.length-1));
  puts(spacer + "--- ".repeat(resultPointer+1));
  puts(spacer + hdr);
  puts(spacer + str);
  puts(spacer + "--- ".repeat(resultPointer+1));
}

function resetAll() {       // should be refactored later
  document.getElementById("expression").value = "";
  displayArea = document.getElementById("displayArea").value = "";
  resultPointer = 0;
  divisorPointer = 0;
  valuePointer = 0;
  stagePointer = "INIT";
  workArray = [];
  stepCounter=1;
  rp = 0;
  wrp = 0;
  xrp = 0;
  p = 1;
  document.input.text.focus();
}
