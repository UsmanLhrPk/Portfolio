/*
 * Project #3
 * Keeping Up With the Javascripts - Part 1: ES6
 * Pirple
 * 
 * @author: Usman Javaid
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

class Elevator {
  constructor(name, minFloor, maxFloor) {
    this.name = name
    this.minFloor = minFloor
    this.maxFloor = maxFloor

    this.queueDirection = null
    this.elevatorDirection = null

    this.queue = {
                  "up": [],
                  "down": [],
                  "upNext": null,
                  "downNext": null,
                 }

    this.destinationFloor = null
    // If the elevator goes to ground floor than that must be the initial floor
    // Otherwise it should be at the elevator's minFloor 
    this.currentFloor = minFloor <= 0 ? 0 : minFloor 

    this.isMoving = false

    this.interval = null
  }

  selectQueueDirection() {
    const otherQueue = this.otherQueueDirection() // if queueDirection = "up"; otherQueue = "down" and vice versa
    if (this.queueDirection) { // If queueDirection is not null
      if (this.queue[this.queueDirection].length === 0) { // If queue in queueDirection is empty
        if (this.queue[otherQueue].length > 0) {
          this.queueDirection = otherQueue
        } else {
          this.queueDirection = null
        }
      } else if (this.queue[this.queueDirection].length > 0) { // If the queue in queueDirecion is not empty
        if (this.queueDirection === "up" && this.queue["upNext"] < this.currentFloor) {
          this.queueDirection = this.queue["down"].length > 0 ? "down" : null
        } else if (this.queueDirection === "down" && this.queue["downNext"] > this.currentFloor) {
          this.queueDirection = this.queue["up"].length > 0 ? this.queueDirection = "up" : this.queueDirection = null
        }
      }
    } else { // If queueDirection is null
      if (this.queue["up"].length > 0 && this.queue["down"].length === 0) { // down queue is empty and up queue is not
        this.queueDirection = "up"
      } else if (this.queue["down"].length > 0 && this.queue["up"].length === 0) { // up queue is empty and down queue is not
        this.queueDirection = "down"
      } else if (this.queue["up"].length > 0 && this.queue["down"].length > 0) { // both queues not empty
        // Choose the queue whose next floor is closest to the current floor
        if ((this.queue["up"][0] - this.currentFloor) <= (this.currentFloor - this.queue["down"][0])) {
          this.queueDirection = "up"
        } else if ((this.queue["up"][0] - this.currentFloor) >= (this.currentFloor - this.queue["down"][0])) {
          this.queueDirection = "down"
        }
      }
    }
  }

  // Call the elevator to the floor
  call(floor, direction=null) {
    if (floor !== this.currentFloor) {
      if (!direction) {
        // If the direction is null
        // Choose direction based on the current floor relative to the selected floor
        if (this.currentFloor < floor) {
          direction = "up"
        } else if (this.currentFloor > floor) {
          direction = "down"
        }
      }

      if (!this.queue[direction].includes(floor)) { // Make sure the floor called isn't alread in queue
        this.queue[direction].push(floor)

        if (this.isMoving) {
          this.selectDestinationFloor() // update the destination floor accordingly
        } else {
          this.isMoving = true
          this.moveElevator()
        }
        consoleLog(`The current queue is <span class="number">${JSON.stringify(this.queue)}</span>`, this.name);
      } else { // if (!this.queue[direction].includes(floor))
        consoleLog(`Floor <span class="number">${floor}</span> already in queue`, this.name)
      }


    } else { // if (floor !== this.currentFloor) {
      consoleLog("Elevator is already at the selected floor", this.name)
    }
  }

  selectDestinationFloor() {
    // upNext
    if (this.queue["up"].length > 0) { //
      let upQueue = this.queue["up"].map ((e) => e)
      upQueue.sort() // => [0, 1, 2, 3, ....]
      if (upQueue[0] > this.currentFloor) {
        this.queue["upNext"] = upQueue[0]
      } else if (upQueue[0] < this.currentFloor) {
        this.queue["upNext"] = upQueue.reverse()[0]
      }
    } else {
      this.queue["upNext"] = null
    }
    // downNext
    if (this.queue["down"].length > 0) {
      let downQueue = this.queue["down"].map ((e) => e)
      downQueue.sort() // => [0, 1, 2, 3, ....]
      if (downQueue[0] < this.currentFloor) {
        this.queue["downNext"] = downQueue.reverse()[0]
      } else if (downQueue[0] > this.currentFloor) {
        this.queue["downNext"] = downQueue[0]
      }
    } else {
      this.queue["downNext"] = null
    }

    // destinationFloor
    if (this.queue["upNext"] !== null || this.queue["downNext"] !== null){
      if (this.queueDirection === "up") {
        this.destinationFloor = this.queue["upNext"]
      } else if (this.queueDirection === "down") {
        this.destinationFloor = this.queue["downNext"]
      }
    } else {
      if (this.isMoving) {
        this.destinationFloor = null
        this.stopElevator()
      }
    }
    this.destinationFloor ? consoleLog(`The current destination is: <span class="number">${this.destinationFloor}</span>`, this.name) : "EMPTY";
  }

  moveElevator() {
    if (this.isMoving) {
      if(!this.queueDirection) {
        this.selectQueueDirection()
        this.selectDestinationFloor()
      }

      if (this.destinationFloor !== null && this.queueDirection) {
        this.interval = setInterval(() => {
          if (this.destinationFloor > this.currentFloor) {
            this.currentFloor++;
          } else if (this.destinationFloor < this.currentFloor) {
            this.currentFloor--;
          }
          consoleLog(`The current floor is: <span class="number">${this.currentFloor}</span>`, this.name);
          updateCurrent(this.currentFloor, this.name);

          if (this.currentFloor === this.destinationFloor) {
            this.handleElvArrival()
          }
        }, 1000)
      }
    }
  }

  handleElvArrival() {
    deselectFloor(this.currentFloor, this.name);
    consoleLog(`Elevator arrived at floor <span class="number">${this.currentFloor}</span>`, this.name);
    consoleLog(`DOORS &lArr; &rArr; OPENING`, this.name, {"background-color": "green", "color": "white", "font-size": "1.25rem", "text-align": "center"});

    let i = this.queue[this.queueDirection].indexOf(this.currentFloor)
    this.queue[this.queueDirection].splice(i, 1)
    consoleLog(`The ${this.queueDirection} queue now is: <span class="number">${JSON.stringify(this.queue[this.queueDirection])}</span>`, this.name);

    clearInterval(this.interval);
    setTimeout(() => {
      consoleLog("DOORS &rArr; &lArr; CLOSING", this.name, {"background-color": "magenta", "color": "white", "font-size": "1.25rem", "text-align": "center"});

      this.selectQueueDirection()
      this.selectDestinationFloor()
      this.moveElevator()
    }, 3 * 1000)
  }

  stopElevator() {
    this.isMoving = false
    clearInterval(this.interval)
    this.interval = null
    consoleLog(`The elevator has now stopped!`, this.name, {"background-color": "black", "color": "white", "text-align": "center"});
    consoleLog(`Queue is now <span class="number">${JSON.stringify(this.queue["up"]), JSON.stringify(this.queue["down"])}</span>`, this.name);
    consoleLog(`Current floor is: <span class="number">${this.currentFloor}</span>`, this.name);
  }

  otherQueueDirection() {
    return this.queueDirection === "up" ? "down" : this.queueDirection === "down" ? "up" : null
  }
}

let elvA = new Elevator("A", -1, 9);
let elvB = new Elevator("B", 0, 10);



function callElevator() {
  let classes = Array.from(elvFloors[this.dataset.elevator][this.dataset.floor].classList);
  let thisElementClasses = Array.from(this.classList)
  let [floor, elv] = [parseInt(this.dataset.floor), this.dataset.elevator];
  let direction = this.dataset.direction ? this.dataset.direction : null
  let elevator = elv === "A" ? elvA : elvB;
  if (classes.includes("selected") || floor === elevator.currentFloor) {
    if (classes.includes("selected")) {
      consoleLog(`Floor <span class="number">${this.dataset.floor}</span> is already in queue`, this.dataset.elevator)
    } else if (floor === elevator.currentFloor) {
      consoleLog(`<span class="number">${this.dataset.floor}</span> is the current floor`, this.dataset.elevator)
    }
  } else {
    thisElementClasses.includes("direction-indicator") ? null : this.classList.add("selected")
    elvFloors[this.dataset.elevator][this.dataset.floor].classList.add("selected")

    let d = new Date();

    consoleLog(`Elevator has been called to floor: <span class="number">${floor}</span> @ "${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}" on "${d.getMonth()}-${d.getDate()}-${d.getFullYear()}"`, elv)
    elevator.call(floor, direction);
  }
}

function consoleLog(msg, elv, options={}) {
  let table = elv == "A" ? tableA : tableB
  table.innerHTML += `<tr class="status">
                        <td class="stat-col">&#8667;</td>
                        <td class="stat-msg"> ${msg} </td>
                      </tr>`;

  if (Object.keys(options).length > 0) {
    for(const opt in options) {
      table.lastChild.style[opt] = options[opt]
    }
  };
  table.parentNode.scrollTop += table.parentNode.scrollHeight;
  console.log(msg);
}

function updateCurrent(current, elv) {
  let prev = document.querySelector(`div[data-elevator="${elv}"].current`);
  prev.classList.remove("current")

  elvFloors[elv][current].classList.add("current");
}

function deselectFloor(current, elv) {
  elvFloors[elv][current].classList.remove("selected");
}

function stopElv() {
  let elevator = this.dataset.elevator === "A" ? elvA : elvB;
  if(elevator.isMoving) {
    elevator.stopElevator();
  } else {
    consoleLog("The elevator is not moving!", elevator.name);
  }
}

function runElv() {
  let elevator = this.dataset.elevator === "A" ? elvA : elvB;
  if(elevator.isMoving) {
    consoleLog("The elevator is already running", elevator.name);
  } else {
    if (elevator.queueDirection) {
      elevator.isMoving = true;
      elevator.moveElevator();  
    } else {
      consoleLog("The queue is empty", elevator.name);
    }
  }
}

// The following code will run at the beginning. To offload the reparsing of the same elements over and over again.
let tableA = document.getElementById("logA");
let tableB = document.getElementById("logB");
let floorsA = document.querySelectorAll("div[data-elevator='A'].indicator");
floorsA = Array.from(floorsA);
floorsA.sort((a, b) =>{
  return parseInt(a.dataset.floor) - parseInt(b.dataset.floor)
});


let floorsB = document.querySelectorAll("div[data-elevator='B'].indicator");
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
}

for(const f in floorsB) {
  elvFloors["B"][f] = floorsB[f];
}

/*
  setInterval(() => {
    let floor = Math.floor(Math.random() * 10) - 1;
    let direction = Math.floor(Math.random() * 2);

    let d = new Date();

    console.log(`
  =================================================================================================================================================
  Elevator has been called to floor: "${floor}" @ "${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}" on "${d.getMonth()}-${d.getDate()}-${d.getFullYear()} "
  =================================================================================================================================================
    `)

    if (direction === 0) {
      elvA.call(floor, "down");
    } else {
      elvA.call(floor, "up");
    }


  }, Math.floor(Math.random() * 30000) + 1000);
*/
