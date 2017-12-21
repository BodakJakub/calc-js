var UIController = (function() {
  var DOMvalues = {
    userInput: ".calc__input-field"
  }
  
  return {
    clearInput: function(){
      // clears the input field after user presses enter or =
      document.querySelector(DOMvalues.userInput).textContent = "";
    },
    
    updateResult: function(res){
      document.querySelector(".calc__result").textContent = res;
    },
//    printToInput: function(k){
//      if (document.querySelector(DOMvalues.userInput).textContent === "0" || k === ""){
//        document.querySelector(DOMvalues.userInput).textContent = k;
//      } else {
//        document.querySelector(DOMvalues.userInput).textContent += k;
//      }
//    }
  }
  
})();

var MathController = (function(){
  
  var data = {
    numsArray: [],
    total: 0,
    mode: "+",
    keyCodes: {
      "48": 0,
      "49": 1,
      "50": 2,
      "51": 3,
      "52": 4,
      "53": 5,
      "54": 6,
      "55": 7,
      "56": 8,
      "57": 9,
      "46": "."
    },
    //this should always be only one element
    newInput: true,
    canCalculate: true
  }
  
  //accepts one string, math problem and operator (mode: + - * /)
  var calculate = function(mode, eValue) {
    var operations = {
      "+": function(a, b){ return a + b },
      "-": function(a, b){ return a - b },
      "*": function(a, b){ return a * b },
      "/": function(a, b){ return a / b },
      "none": function(a, b) { return data.total }
    };
    
    if(eValue){
      data.total = operations[mode](data.numsArray[data.numsArray.length - 2], eValue);
      data.numsArray.push(data.total);
    } else if (!eValue){
      //here we choose function from our object base on current mode
      //mode is changed by the user, inital value is "+" 
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
    
    testing: function(){
      console.log(data.numsArray);
      console.log(data);
    }
  }
})();

var controller = (function(UICtrl, MathCtrl){
  var inputValue = document.querySelector(".calc__input-field").textContent;
  var nums = MathCtrl.getNumsArray();
  
        //MOVE OUTSIDE THE EVENT LISTENER
      var useOperators = function(m){
        if(MathCtrl.getCanCalculate()){  
          if (nums.length === 0){
            console.log(inputValue)
            MathCtrl.pushNumsArray(parseFloat(inputValue));
            UICtrl.updateResult(MathCtrl.getLastNum());
            
            MathCtrl.setCanCalculate(false);
          } else {    
            console.log("CanCalculate: " + MathCtrl.getCanCalculate())
            if(inputValue !== "0"){
              MathCtrl.pushNumsArray(parseFloat(inputValue));
            }
            console.log("CanCalculate: " + MathCtrl.getCanCalculate())
            MathCtrl.calculateTotal();
            UICtrl.updateResult(MathCtrl.getLastNum());

            MathCtrl.setCanCalculate(false);
          }
      }
      MathCtrl.setMode(m);
      MathCtrl.setNewInput(true);
    }
      
  
  
  var evntListeners = function(){
    var keys;

    document.querySelector(".calc__num").addEventListener("click", function(e){
      if(MathCtrl.getNewInput()){
        UICtrl.clearInput();
        MathCtrl.setNewInput(false);
      }
          
      // get keyCodes and what number they represent from our global data structure
      keys = MathCtrl.getKeyCodes();
          
      // then we pass specific keycode to our UI ctrl function that will then print it to the screen
      // we have to convert e.keyCode to String because thats how keys in JS objects work
      document.querySelector(".calc__input-field").textContent += keys[String(e.target.getAttribute("id"))];
      console.log("id + " + e.target.getAttribute("id"));
      MathCtrl.setCanCalculate(true);
    });
    
    
    // KEYBOARD CONTROL
    document.addEventListener('keypress', function(e){      
      document.querySelector(".themes").textContent = "CanCalculate: " + MathCtrl.getCanCalculate();
      //POSSIBLY MOVE THIS DECLARATION ELSEWHERE, IF NEEDED
      inputValue = document.querySelector(".calc__input-field").textContent;

      //console.log(e.keyCode)
      
      switch(e.which){
        case 114: // enter
          if(MathController.getCanCalculate()){
            useOperators("+");
          }
          //MathCtrl.setCanCalculate(false);
          break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 46:
          if(MathCtrl.getNewInput()){
            UICtrl.clearInput();
            MathCtrl.setNewInput(false);
          }
          
          // get keyCodes and what number they represent from our global data structure
          keys = MathCtrl.getKeyCodes();
          
          // then we pass specific keycode to our UI ctrl function that will then print it to the screen
          // we have to convert e.keyCode to String because thats how keys in JS objects work
          document.querySelector(".calc__input-field").textContent += keys[String(e.keyCode)];
          MathCtrl.setCanCalculate(true);
          break;
        case 43: // +
          useOperators("+");
          break;
        case 45: // -
          useOperators("-");
          break;
        case 42: // *
          useOperators("*");
          break;
        case 47: // /
          useOperators("/");
          break;
        case 117: // del
          // clears calculator after user presses DEL
          UICtrl.clearInput();
          UICtrl.updateResult(0);
          MathCtrl.setMode("+");
          MathCtrl.setTotal(0);
          MathCtrl.resetNumsArray();
          break;
      }
    });
    
    //ONSCREEN CONTROL
    
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