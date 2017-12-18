var UIController = (function() {
  
  return {
    clearInput: function(){
      // clears the input field after user presses enter or =
      document.querySelector(".calc__input-field").value = "";
    },
    
    updateResult: function(res){
      document.querySelector(".calc__result").textContent = res;
    }
  }
  
})();

var MathController = (function(){
  
  numsArray = [];
  
  //accepts one string, math problem
  var calculate = function(nums, op) {
    var result;
    switch(op) {
      case "+":
        result = nums[nums.length - 2] + nums[nums.length - 1];
        break;
      case "-":
        result = nums[nums.length - 2] - nums[nums.length - 1];
        break;
    }
    return result;
  }
  
  return {
    setNumsArray: function(num) {
      if(typeof num === "number" && !isNaN(num)){
        numsArray.push(num);
      }
    },
    
    getNumsArray: function(){
      return numsArray;
    },
    
    getResult: function(num, ops){
      return calculate(num, ops);
    },
    
    testing: function(){
      console.log(numsArray);
    }
  }
})();

var controller = (function(UICtrl, MathCtrl){
  
  
  var evntListeners = function(){
    
    document.addEventListener('keyup', function(e){
      //POSSIBLY MOVE THIS DECLARATION ELSEWHERE, IF NEEDED
      var nums = MathCtrl.getNumsArray(),
          mode = "+";
      inputValue = document.querySelector(".calc__input-field").value;
      
//      console.log(e.keyCode);
      
      switch(e.keyCode){
        case 13:
        case 187:
          // if more than 1 number already written, it will add it into numsArr array with all the numbers
          if(nums.length > 0){  
            var result;
            // adds the number into the array
            inputValue = document.querySelector(".calc__input-field").value;
            MathCtrl.setNumsArray(parseInt(inputValue));
            
            //updates the UI
            UICtrl.updateResult(nums[nums.length - 1]);
            
            // calculates number based on previous inputs from the user
            console.log(MathCtrl.getNumsArray());
            result = MathCtrl.getResult(MathCtrl.getNumsArray(), mode);
            
            //3. clear the input field
            UICtrl.clearInput();
            
            //4. display the result
            console.log(result);
            UICtrl.updateResult(result);
          }
          
          break;
          
          //we are going to make a function for the rest of the operators that will take them as an argument and add them to math problem builder
          //probably doesnt have to be switch, only simple if( + || - || / || *)
        case 107: // +     
          // adds number to the array
          MathCtrl.setNumsArray(parseInt(inputValue));
          
          
          // updates UI
          //sets "mode" variable
          mode = "+";
          
          // calculates intermediate value if more than 1 number
          if(nums.length > 1){
            MathCtrl.getResult(MathCtrl.getNumsArray(), mode);
          };
          
          // clears output
          UICtrl.clearInput();
          break;
        case 109: // -
          console.log("- was pressed");
          break;
        case 106:
          console.log("* was pressed");
          break;
        case 111:
          console.log("/ was pressed");
          break;
        case 46:
          // clears calculator after user presses DEL
          UICtrl.clearInput();
          UICtrl.updateResult(0);
      }
    });
  };
  
  return {
    init: function(){
      console.log("App has started");
      evntListeners();
    }
  }
  
})(UIController, MathController);

controller.init();