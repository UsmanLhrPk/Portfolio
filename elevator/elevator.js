/*
 * Project #3
 * Keeping Up With the Javascripts - Part 1: ES6
 * Pirple
 * 
 * Usman Javaid
 */

/*
 * You've been hired by a construction firm to help build the "brain"
 * for a set of elevators in a new building. Your task is to write
 * the code that will control the elevators, and tell each elevator
 * which floor to travel to next.
 * 
 * OBJECT 1: Elevator
 * 
 * 1. The user click the button on the floor (up or down)
 * 2. If the elevator is already moving, and is in the same direction as selected by the user; 
 *      then the elevator stops at the floor to pick up the user.
 *    Else if it is moving in the opposite direction and needs to go beyond the floor the user is at 
 *      then the elevator will first go the last floor beyond the floor the user is at;
 *      then it will go to the floor the user is at according to the queue.
 *    Else
 *      it will move directly to the floor the user is at according to the queue.
 * 
 */

const SECOND = 1000;
const UP = 1;
const DOWN = -1;

class Elevator {

  constructor(name, minFloor, maxFloor) {
    this.name = name;
    this.minFloor = minFloor;
    this.maxFloor = maxFloor;

    this.direction = null;
    this.isMoving = false;
    this.queue = {
                  up: [],
                  down: []
                 };

    this.currentFloor = 0;
    this.interval = null;
    this.destinationFloor = null;
  }

  selectDirection() {

    if (this.queue["up"].length > 0) {
      this.direction = "up";
    } else if (this.queue["down"].length > 0) {
        this.direction = "down";
    } else {
      this.direction = null;
    }
    (this.destinationFloor - this.currentFloor) > 0 ? console.log(`The current direction is: up`) : console.log(`The current direction is: down`);
  }

  /*
  *   CALL FUNCTION
  * 
  *   If direction is not null then push the floor to the selected direction in the queue
  *   Otherwise select the direction based on the called floor relative to the current floor
  *    
  */

  call(floor, direction) {

    let validFloor = floor >= this.minFloor && floor <= this.maxFloor && floor !== this.currentFloor; // floor must be within elevator range and current floor cannot be called
    let validDirection = direction === "up" || direction === "down";

    if (validFloor && validDirection) {
      if (this.queue[direction].includes(floor)) {
        consoleLog(`floor ${floor} already in queue`, this.name);

      } else {
        this.queue[direction].push(floor);

        if (direction === this.direction && ( floor < this.destinationFloor && floor - this.currentFloor >= 2)) {
          this.destinationFloor = floor;
          consoleLog(`The destination has been updated to: ${this.destinationFloor}`, this.name);
        }

      }
      
      this.isMoving = true;

    } else {
      console.log("Please enter a valid direction either \"up\" or \"down\"! OR");
      console.log("The elevator does not go to the selected floor!");

    }

    // Get the 'up' queue in ascending order 
    // and 'down' queue in descending order
    this.queue["up"].sort();
    this.queue["down"].sort();
    this.queue["down"].reverse();

    // Call moveElevator when elevator isMoving is set to true 
    // and this.interval is null otherwise it will instantiate multiple interval instances
    if (this.isMoving && !this.interval) { 
      this.moveElevator();
    }

    consoleLog(`The current queue is ${JSON.stringify(this.queue)}`, this.name);
  }

  selectNextFloor() {

    if (this.queue[this.direction].length > 0 || this.queue[this.direction][0] < this.currentFloor) {
      this.destinationFloor = this.queue[this.direction][0];

    } else {

      if (this.direction === "up" && this.queue["down"].length > 0) {
        this.direction = "down";
        this.destinationFloor = this.queue[this.direction][0];

      } else if (this.direction === "down" && this.queue["up"].length > 0) {
        this.direction = "up";
        this.destinationFloor = this.queue[this.direction][0];

      } else {
        this.stopElevator();
      }
    }
    
    this.destinationFloor ? consoleLog(`The current destination is: ${this.destinationFloor}`, this.name) : null;
  }

  moveElevator() {
    if (this.isMoving) {
      if (!this.direction) {
        this.selectDirection();
        this.selectNextFloor();
      }
      
      this.interval = setInterval(() => {
        if (this.destinationFloor > this.currentFloor) {
          this.currentFloor++;
        } else {
          this.currentFloor--;
        }
        consoleLog(`The current floor is: ${this.currentFloor}`, this.name);
        deselectFloor(this.currentFloor, this.name);
        updateCurrent(this.currentFloor, this.name);

        if (this.currentFloor === this.destinationFloor) {
          this.handleElvArrival();
        }
      }, SECOND);
    }
  }

  handleElvArrival() {
    consoleLog(`Elevator arrived at floor ${this.currentFloor}`, this.name);
    consoleLog(`DOORS<=< >=>OPENING`, this.name);

    this.queue[this.direction].shift();
    clearInterval(this.interval);
    // updateCurrent(this.currentFloor);
    setTimeout(() => {
      consoleLog("DOORS >=> <=< CLOSING", this.name);
      consoleLog(`The queue now is: ${JSON.stringify(this.queue[this.direction])}`, this.name);

      this.selectNextFloor();
      this.moveElevator();
    }, 3 * SECOND);
  }

  stopElevator() {
    this.isMoving = false;
    this.direction = null;
    this.destinationFloor = null;
    clearInterval(this.interval);
    this.interval = null;
    consoleLog(`The elevator has now stopped!`, this.name);
    consoleLog(`Queue is now ${JSON.stringify(this.queue["up"]), JSON.stringify(this.queue["down"])}`, this.name);
    consoleLog(`Current floor is: ${this.currentFloor}`, this.name);
  }

  wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }



}

let elvA = new Elevator("A", -1, 9);
let elvB = new Elevator("B", 0, 10);

// setInterval(() => {
//   let floor = Math.floor(Math.random() * 10) - 1;
//   let direction = Math.floor(Math.random() * 2);

//   let d = new Date();

//   console.log(`
// =================================================================================================================================================
// Elevator has been called to floor: "${floor}" @ "${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}" on "${d.getMonth()}-${d.getDate()}-${d.getFullYear()} "
// =================================================================================================================================================
//   `)

//   if (direction === 0) {
//     elvA.call(floor, "down");
//   } else {
//     elvA.call(floor, "up");
//   }


// }, Math.floor(Math.random() * 30000) + 1000);
// 

function callElevator() {
  let classes = Array.from(this.classList);
  if (classes.includes("selected")) {
    consoleLog(`Floor ${this.dataset.floor} is already in queue`, this.dataset.lift)
  } else {
    classes.includes("current") ? null : this.classList.add("selected");  // only select if it's not the floor the evelator is currently at
    console.log(this)

    let d = new Date();
    let [floor, elv, direction] = [parseInt(this.dataset.floor), this.dataset.lift, "up"];

    consoleLog(`Elevator has been called to floor: "${floor}" @ "${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}" on "${d.getMonth()}-${d.getDate()}-${d.getFullYear()}"`, elv)
    elv === "A" ? elvA.call(floor, direction) : elvB.call(elv, direction);
  }
}

function consoleLog(msg, elv) {
  let table = elv == "A" ? tableA : tableB
  table.innerHTML += `<tr class="status">
                        <td class="stat-col">==></td>
                        <td class="stat-msg"> ${msg} </td>
                      </tr>`;
  table.parentNode.scrollTop += table.parentNode.scrollHeight;
  console.log(msg);
}



function updateCurrent(current, elv) {
  let prev = document.getElementsByClassName("current");
  prev[0].classList.remove("current")
  // prev.classList.remove("current");

  elvFloors[elv][current].classList.add("current");

}

function deselectFloor(current, elv) {
  elvFloors[elv][current].classList.remove("selected");
}

// The following code will run at the beginning. To offload the reparsing of the same elements over and over again.
let tableA = document.getElementById("logA");
let tableB = document.getElementById("logB");
let floorsA = document.querySelectorAll("div[data-lift='A']");
floorsA = Array.from(floorsA);
floorsA.sort((a, b) =>{
  return parseInt(a.dataset.floor) - parseInt(b.dataset.floor)
});


let floorsB = document.querySelectorAll("div[data-lift='B']");
floorsB = Array.from(floorsB);
floorsB.sort((a, b) =>{
  return parseInt(a.dataset.floor) - parseInt(b.dataset.floor)
});

const elvFloors = {
  "A": {},
  "B": {}
}

for(const f in floorsA) {
  elvFloors["A"][f-1] = floorsA[f]
  console.log(elvFloors["A"])
}
