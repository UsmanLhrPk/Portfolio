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
        console.log(`floor ${floor} already in queue`)

      } else {
        this.queue[direction].push(floor);

        if (direction === this.direction && ( floor < this.destinationFloor && floor - this.currentFloor >= 2)) {
          this.destinationFloor = floor;
          console.log("The destination has been updated to: ", this.destinationFloor);
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

    console.log("The current queue is ", this.queue);
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
    
    this.destinationFloor ? console.log("The current destination is: ", this.destinationFloor) : null;
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
        console.log("The current floor is: ", this.currentFloor);
        if (this.currentFloor === this.destinationFloor) {
          console.log(`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Elevator arrived at floor ${this.currentFloor}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DOORS                                                             OPENING >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          `);

          this.wait(SECOND * 10);
                    console.log(`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DOORS CLOSING <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          `);
          this.queue[this.direction].shift();
          console.log("The queue now is: ", this.queue[this.direction], "\n\n");
          this.selectNextFloor();
        }
      }, SECOND);
    }
  }

  stopElevator() {
    this.isMoving = false;
    this.direction = null;
    this.destinationFloor = null;
    clearInterval(this.interval);
    this.interval = null;
    console.log(`
--------------------------------------------------------------------------------------------------------------------------------------------------
The elevator has now stopped!
Queue is now ${this.queue["up"], this.queue["down"]}
Current floor is: ${this.currentFloor}
--------------------------------------------------------------------------------------------------------------------------------------------------
`);
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




