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
  puts("" + rulerRangeWithValue(resultPointer, resultPointer) + "の半九九（つまり" + (digit * digit / 2.0) + "）を" + rulerRange(resultPointer+1, valuePointer+1) + "." + rulerRange(valuePointer+2, valuePointer+2) + "から引く。");
  putNumber(temp, resultPointer+1, resultPointer+2);
  outputPanel();
  if (getPartialNumber(resultPointer+1, workArray.length-resultPointer-1) == 0) {
    puts("−終わり−");
    return "FINISHED";
  } else {
    valuePointer = resultPointer + 1;
    puts("半九九減の終了〜見商割に戻る。");
    puts("見商割： 先頭から" + (resultPointer+2) + "桁目の解を導き出す。");
    return "HASSAN";
  }
}

function multiplyAndSubtract() {
  if (divisorPointer >= resultPointer) {
    puts("見商割の終了〜半九九減に。");
    puts("半九九減：");
    return "HALFSQUARESUB";
  }
  var currentResult = getPartialNumber(resultPointer, 1);
  var a = getPartialNumber(divisorPointer, 1);
  puts("  " + rulerRange(resultPointer, resultPointer) + "×" + rulerRange(divisorPointer, divisorPointer) + "の商を" + rulerRange(resultPointer+1, valuePointer+1) + "から引く。");
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
    puts("  仮の値は大きすぎて割れないため、帰一倍" + kanji[getPartialNumber(0, 1)] + "する（つまり" + rulerRangeWithValue(resultPointer, resultPointer) + "から1を引いて右の桁に" + getPartialNumber(0, 1) + "を足す）。");
    putNumber(getPartialNumber(resultPointer, 1) - 1, resultPointer, 1);
    putNumber(getPartialNumber(resultPointer+1, 1) + getPartialNumber(0, 1), resultPointer + 1, 1);
    outputPanel();
    return "CHEATCHECK";
  }
  puts("仮の値でうまく割れる。");
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
      put("法" + rulerRange(0, 0) + "と" + rulerRange(valuePointer, valuePointer) + "を見合わせ：" + kanji[getPartialNumber(0, 1)] + kanji[getPartialNumber(valuePointer, 1)]);
      if (((hou == 2) && (jitsu == 1)) ||
          ((hou == 4) && (jitsu == 2)) ||
          ((hou == 6) && (jitsu == 3)) ||
          ((hou == 8) && (jitsu == 4))) {
        put("天作五");
      } else {
        if  (hou == 5) {
          put("倍作" + kanji[wrg1]);
        } else {
          if (wrg1 == jitsu) {
            put("下加" + kanji[wrg2]);
          } else {
            put(kanji[wrg1] + "十" + kanji[wrg2]);
          }
        }
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
      puts("法" + rulerRange(0, 0) + "と" + rulerRange(valuePointer+1, valuePointer+1) + "を見合わせ：" + kanji[ctr * hou] + "進" + kanji[ctr] + "十");
      outputPanel();
    }
  } else {
    workArray[valuePointer] = 9;
    workArray[valuePointer + 1] += hou;
    puts("見一無頭作九" + kanji[hou]);
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
  puts("  " + rulerRange(valuePointer, valuePointer) + "の処理");
  while (workArray[valuePointer] >= 2) {
    left++;
    workArray[valuePointer-1]++;
    workArray[valuePointer] -= 2;
  }
  if (left > 0) {
    puts("    " + ruler[valuePointer] + "： " + kanji[left * 2] + "進" + kanji[left] + "十");
    processed = true;
  }
  if (workArray[valuePointer] == 1) {
    puts("    "  + ruler[valuePointer] + "：二一天作五");
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
    puts("    " + ruler[valuePointer+1] + "： " + kanji[counter * 2] + "進" + kanji[counter] + "十");
    processed = true;
  }
  if (processed == false) {
   puts("    この桁は処理なし。");
  }
  outputPanel();
  if (valuePointer < workArray.length-1) {
    valuePointer++;
    return "DIVBY2";
  } else {
    puts("二法割おわり〜見商割へ");
    resultPointer = 0;
    valuePointer = 1;
    puts("見商割： 左端から" + (resultPointer+2) + "桁目の解を求める。");
    return "HASSAN";
  }
}

function subtractSquare() {
  var top = getPartialNumber(0, 1);
  var val = getPartialNumber(1, 2);
  val -= (top * top);
  puts("" + rulerRangeWithValue(0, 0) + "の平方、つまり" + (top*top) + "を" + rulerRangeWithValue(1, 2) + "から減じ" + rulerRange(1,2) + "に布数する。");
  putNumber(val, 1, 2);
  outputPanel();
  valuePointer = 1;
  if (getPartialNumber(1, workArray.length-1) == 0) {
    puts("終わり");
    return "FINISHED";
  } else {
    puts("二法割： " + rulerRangeWithValue(1, workArray.length-1) + "を2で割る（八算の割り声を使用）");
    return "DIVBY2";
  }
}

function determineTopDigit() {
  var num = getPartialNumber(1, 2);
  var tmp = 9;
  while (tmp*tmp > num)  tmp--;
  puts("解の最上位桁を求める： " + rulerRangeWithValue(p, p+1) + "を超えない平方数は" + tmp + "であるため、その値を" + ruler[rp] + "に布数する。");
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
    puts("エラー");
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
  puts("まず、数値を2桁ずつ区切り、それらを[B]以降に布数する（[A]は解の最上位桁に使用される）。");
  if (inputValue.substring(0, 1) === "0") {     // Place number to array
    puts("  値" + inputValue.slice(1) + "を[C]から" + ruler[inputValue.length] + "に布数する。");
  } else {
    puts("  値" + inputValue + "を[B]から" + ruler[inputValue.length] + "に布数する。");
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
var kanji = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
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
