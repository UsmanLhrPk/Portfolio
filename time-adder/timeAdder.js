const timeAdder = (value1, label1, value2, label2) => {
  correctValueType = (typeof(value1) === "number" && typeof(value2) === "number"); // Both value2 and value2 must be numbers
  correctValueType = correctValueType ? ((value1 % 1 === 0) && (value2 % 1 === 0)) : false; // value1 and value2 must be integers
  correctLabelType = ((realTypeOf(label1) === "string") && (realTypeOf(label2) === "string")); // both labels must be strings

  let value3 = null;
  let label3 = null;


  if (correctLabelType  && correctValueType) {
    value1 = toSeconds(value1, label1);
    value2 = toSeconds(value2, label2);

    if (typeof(value1) === "number" && typeof(value2) === "number") {
      if (value1 >= 0 && value2 >= 0) {
        let value3, label3;
        [value3, label3] = addTimeAndDecideUnit(value1, value2)
        console.log(value3, label3);
        return [value3, (value3 > 1 || value3 === 0 || value3 < -1) ? (label3 + "s") : label3];
      } else {
        return value1 ? (value2 ? value1 : value2) : value1 + value2;
      } 
    } else {
      let err = null;
      if (typeof(value1) !== "number") { err = value1 }
      if (typeof(value2) !== "number") { 
        if (err) {
          err = err.split(". ");
          err[0] += " for both entries. ";
          err = err.join(" ");
        }
      }
      return err;
    }
  } else {
    return false;
  }
};

// Auxiliary function
function realTypeOf (x) { 
  if (isNaN(x) || (typeof(x) === "boolean")) {
    return typeof(x);
  } else {
    return "number";
  }
} // find real type of the input

function isPlural(val) {
  val = val.split("");
  return (val[val.length - 1] === "s") ? true : false;
} // rudimentry function to find if val is plural or not. Only to be used with plurals ending with as 's'

function toSeconds(time, unit) {
  isUnitPlural = isPlural(unit);
  if (typeof(time) === "number" && time >= 0) { // remove '&& time >= 0' from this condition to allow negative time as well
    if (isUnitPlural && (time > 1 || time === 0 || time < -1)) {
      switch (unit) {
        case "seconds":
          return time; 
          break;
        case  "minutes":
          return  time * 60;
          break;
        case  "hours":
          return  time * 3600;
          break;
        case  "days":
          return  time * 86400;
          break;
        default:
          console.log("Invalid unit entered. Please use seconds, minutes, hours, days");
          return "Invalid unit entered. Please use seconds, minutes, hours, days";
          break;
      } 
    } else if (!isUnitPlural  && (time === 1 || time === -1)) {
      switch (unit) {
        case "second":
          return time; 
          break;
        case  "minute":
          return  time * 60;
          break;
        case  "hour":
          return  time * 3600;
          break;
        case  "day":
          return  time * 86400;
          break;
        default:
          console.log("Invalid unit entered. Please use second, minute. hour or day");
          return "Invalid unit entered. Please use second, minute. hour or day";
          break;
      } 
    } else {
      console.log("Invalid unit and time combination entered. Please use plural unit (\"seconds\", \"minutes\", \"hours\", \"days\") with time greater than 1 and singluar unit (\"second\", \"minute\", \"hour\", \"day\") with time equal to 1");
      return "Invalid unit and time combination entered. Please use plural unit (\"seconds\", \"minutes\", \"hours\", \"days\") with time greater than 1 and singluar unit (\"second\", \"minute\", \"hour\", \"day\") with time equal to 1";
    }
  } else {
    console.log("Invalid time entered. Please enter a positive integer for time");
    return "Invalid time entered. Please enter a positive integer for time";
  }
} // convert to the smallest unit of time under consideration (seconds)

function addTimeAndDecideUnit (time1, time2) {
  const time3 = time1 + time2;

  if (time3 !== 0) {
    if (time3 % 315532800 === 0 ) {
      return [time3 / 315532800, "decade"];
    } else if (time3 % 31536000 === 0 ) {
      return [time3 / 31536000, "year"];
    } else if (time3 % 2592000 === 0 ) {
      return [time3 / 2592000, "month"];
    } else if (time3 % 86400 === 0) {
      return [time3 / 86400, "day"];
    } else if(time3 % 3600 === 0) {
      return [time3 / 3600, "hour"];
    } else if (time3 % 60 === 0) {
      return [time3 / 60, "minute"];
    } else {
      return [time3, "second"];
    }
  } else {
    return [time3, "second"];
  }
} // this functino decides which unit to be used

// console.log(timeAdder(0, "days", 0, "minutes"));

document.addEventListener("DOMContentLoaded", () => {
  let form = document.querySelector("#time-form");
  let plus = document.querySelector("#plus");
  let descriptionHeading = document.querySelector("#description-heading");
  let description = document.querySelector("#description");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form = document.querySelector("#time-form");

    let result = timeAdder(parseInt(form.elements['time1'].value), form.elements['unit1'].value, parseInt(form.elements['time2'].value), form.elements['unit2'].value)

    let divResult = document.querySelector("#result");
    let finalResult = document.querySelector("#result-div");
    let errorDiv = document.querySelector("#error-field");
    
    switch (typeof(result) && result.length === 2) {
      case true:
        divResult.classList = "success";
        finalResult.innerHTML = `${result[0]} ${result[1]}`;
        errorDiv.classList = "";
        errorDiv.innerHTML = null;
        break;
      default:
        divResult.classList = "error";
        finalResult.innerHTML = `ERROR`;
        errorDiv.innerHTML = result;
        errorDiv.classList = "height";
    }
  })

  let count = 0
  descriptionHeading.addEventListener("click", (e) => {
    e.preventDefault();
    count = 1 - count;
    if (count) {
      description.classList = "show"
      plus.innerHTML = "-"
    } else {
      description.classList = ""
      plus.innerHTML = "+"
    }
  })
})
