var UIController = (function() {
  var DOMvalues = {
    userInput: ".calc__input-field"
  }
  
  return {
    clearInput: function(){
      // clears the input field after user presses enter or =
      document.querySelector(DOMvalues.userInput).textContent = "0";
    },
    
    updateResult: function(res){
      document.querySelector(".calc__result").textContent = res;
    },
    printToInput: function(k){
      if (document.querySelector(DOMvalues.userInput).textContent === "0" || k === ""){
        document.querySelector(DOMvalues.userInput).textContent = k;
      } else {
        document.querySelector(DOMvalues.userInput).textContent += k;
      }
    }
  }
  
})();

var MathController = (function(){
  
  var data = {
    numsArray: [],
    total: 0,
    mode: "+",
    keyCodes: {
      "96": 0,
      "97": 1,
      "98": 2,
      "99": 3,
      "100": 4,
      "101": 5,
      "102": 6,
      "103": 7,
      "104": 8,
      "105": 9,
      "110": "."
    },
    //this should always be only one element
    newInput: true,
    canCalculate: true,
    enterValue: 0
  }
  
  //accepts one string, math problem and operator (mode: + - * /)
  var calculate = function(mode, eValue) {
    console.log("calculate fn")
    var operations = {
      "+": function(a, b){ return a + b },
      "-": function(a, b){ return a - b },
      "*": function(a, b){ return a * b },
      "/": function(a, b){ return a / b },
      "none": function(a, b) { return data.total }
    };
    
    if(eValue){
      console.log("first calculate branch running...")
      data.total = operations[mode](data.numsArray[data.numsArray.length - 2], eValue);
      data.numsArray.push(data.total);
    } else if (!eValue){
      //here we choose function from our object base on current mode
      //mode is changed by the user, inital value is "+" 
      console.log("second calculate branch running...")
      data.total = operations[mode](data.numsArray[data.numsArray.length - 2], data.numsArray[data.numsArray.length - 1]);
      data.numsArray.push(data.total);
    }
    
    
  }
  
  return {
   pushNumsArray: function(num) {
      if(typeof num === "number" && !isNaN(num)){
        data.numsArray.push(num);
      }
    },
    
    resetNumsArray: function() {
      data.numsArray = [];
    },
    
    setNumsArray: function(n){
      data.numsArray[0] = n;
    },
    
    getNumsArray: function(){
      return data.numsArray;
    },
    
    getMode: function(){
      return data.mode;
    },
    
    setMode: function(m){
      data.mode = m;
    },
    
    getLastNum: function(){
      console.log("getLastNum: " + data.numsArray[data.numsArray.length - 1])
      return data.numsArray[data.numsArray.length - 1];
    },
    
    setTotal: function(t){
      data.total = t;
    },
    
    calculateTotal: function(e){
      calculate(data.mode, e);
    },
    
    getKeyCodes: function(){
      return data.keyCodes;
    },
    getNewInput: function(){
      return data.newInput
    },
    setNewInput: function(i){
      data.newInput = i;
    },
    
    getCanCalculate: function(){
      return data.canCalculate;
    },
    setCanCalculate: function(c){
      data.canCalculate = c;
    },
    
    getEnterValue: function(){
      return data.enterValue;
    },
    
    setEnterValue: function(e){
      data.enterValue = e;
    },
    
    testing: function(){
      console.log(data.numsArray);
      console.log(data.newInput);
    }
  }
})();

var controller = (function(UICtrl, MathCtrl){
  
  
  var evntListeners = function(){
    
    // KEYBOARD CONTROL
    document.addEventListener('keyup', function(e){
      //POSSIBLY MOVE THIS DECLARATION ELSEWHERE, IF NEEDED
      var nums = MathCtrl.getNumsArray();
      var inputValue = document.querySelector(".calc__input-field").textContent;
      var keys;
      console.log(e.keyCode)
      
      //MOVE OUTSIDE THE EVENT LISTENER
      var useOperators = function(m){
        console.log(m)
        if (nums.length === 0){
          console.log(inputValue)
          MathCtrl.pushNumsArray(parseFloat(inputValue));
          UICtrl.updateResult(MathCtrl.getLastNum());
          MathCtrl.setMode(m);
          MathCtrl.setCanCalculate(false);
        } else {
          
          if(MathCtrl.getCanCalculate()){
            if(inputValue !== "0"){
              console.log("pushing into array...")
              MathCtrl.pushNumsArray(parseFloat(inputValue));
            }
            console.log("CanCalculate: " + MathCtrl.getCanCalculate())
            MathCtrl.calculateTotal();
            UICtrl.updateResult(MathCtrl.getLastNum());
            MathCtrl.setCanCalculate(false);
            console.log("CanCalculate: " + MathCtrl.getCanCalculate())
          }
          MathCtrl.setMode(m);
        }
        MathCtrl.setNewInput(true);
      }
      
      switch(e.keyCode){
        case 96:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 110:
          if(MathCtrl.getNewInput()){
            UICtrl.printToInput("");
            MathCtrl.setNewInput(false);
          }
          
          // get keyCodes and what number they represent from our global data structure
          keys = MathCtrl.getKeyCodes();
          
          // then we pass specific keycode to our UI ctrl function that will then print it to the screen
          // we have to convert e.keyCode to String because thats how keys in JS objects work
          UICtrl.printToInput(keys[String(e.keyCode)]);
          MathCtrl.setCanCalculate(true);
          break;
        case 13: // enter
        case 187:
          if(MathCtrl.getCanCalculate()){  
            if(nums.length > 0 && inputValue !== "0"){
              console.log("Enter branch 1 runnung");
              MathCtrl.pushNumsArray(parseFloat(inputValue));
              MathCtrl.setEnterValue(parseFloat(inputValue));
              MathCtrl.calculateTotal(false);
              UICtrl.updateResult(MathCtrl.getLastNum());
              console.log("inputValue " + inputValue);
              UICtrl.clearInput();
              MathCtrl.setCanCalculate(false)
            } else if (nums.length > 0 && inputValue === "0"){
              console.log("Enter branch 2 runnung")
              MathCtrl.calculateTotal(MathCtrl.getEnterValue());
              UICtrl.updateResult(MathCtrl.getLastNum());
              MathCtrl.calculateTotal(false);
            }
          }
          break;
        case 107: // +
          useOperators("+");
          break;
        case 109: // -
          useOperators("-");
          break;
        case 106: // *
          useOperators("*");
          break;
        case 111: // /
          useOperators("/");
          break;
        case 46: // del
          // clears calculator after user presses DEL
          UICtrl.clearInput();
          UICtrl.updateResult(0);
          MathCtrl.setMode("+");
          MathCtrl.setTotal(0);
          MathCtrl.resetNumsArray();
      }
    });
    
    //ONSCREEN CONTROL
    
    document.querySelector(".calc__num").addEventListener("click", function(e){
      document.querySelector(".calc__input-field").value = e.target.textContent;
      console.log(document.querySelector(".calc__input-field").value);
    });
    
    
  };
  
  return {
    init: function(){
      console.log("App has started");
      document.querySelector(".calc__input-field").textContent = "0";
      evntListeners();
    },
    inputV: function(){
      return document.querySelector(".calc__input-field").textContent;
    }
  }
  
})(UIController, MathController);

controller.init();