document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const user = sessionStorage.getItem(1);
    if (user) {
      signIn(JSON.parse(user));
    }

    loadHomePage();
  });
});

function loadHomePage() {
  hideAllContainers();

  let user = sessionStorage.getItem(1);

  const main = document.querySelector("#main");

  if  (user) {
    user = JSON.parse(user);
    main.innerHTML += `<div id="homePage" class="container text-center">
                        <h2 id="descHeading">Welcome back ${user.firstName}! Start getting productive right away!</h2>
                        <div id="homePageButtons" class="text-center">
                          <button id="homePageDashboardButton" class="tdl-button">Go to Dashboard </button>
                        </div> 
                      </div>`;  
      const homePageDashboardButton = document.querySelector("#homePageDashboardButton");
    homePageDashboardButton.addEventListener("click", (e) => {
      e.preventDefault();
      loadUserDashboardPage();
    });
  } else {
    main.innerHTML += `<div id="homePage" class="container text-center"> 
                         <h2 id="descHeading">Welcome to to-do Lists. Sign up and get started today,<br>or Login and pick up where you left!</h2> 
                         <div id="homePageButtons" class="text-center"> 
                           <button id="signUp" class="tdl-button">Sign Up</button> 
                           <button id="logIn" class="tdl-button">Log In </button> 
                         </div>
                       </div>`;  
    const signUpButton = document.querySelector("#signUp");
    signUpButton.addEventListener("click", (e) => {
      e.preventDefault();
      loadSignUpPage();
    });

    const logInButton = document.querySelector("#logIn");
    logInButton.addEventListener("click", (e) => {
      e.preventDefault();
      loadLogInPage();
    });
  }

  let status = document.querySelector("#status"); // get the status header

  resetStatus();

  const homeHeading = document.querySelector("#homeHeadingLink");
  homeHeading.addEventListener("click", (e) => {
    e.preventDefault();
    loadHomePage();    
  });
}; // loadHomePage

function loadSignUpPage() {
  hideAllContainers();

  const user = sessionStorage.getItem(1);

  resetStatus();


  const main = document.querySelector("#main");


  if (!user) {
    main.innerHTML +=  `<div id="signUpDiv" class="container"> 
                          <h3 id="signUpHeading" class="text-center">Sign Up</h3> 
                          <hr class="formHR"> 
                          <form id="signUpForm" action="/#"> 
                            <label for="first-name">*First Name</label><br> 
                            <input class="tdl-input" type="text" id="firstName" name="firstName" minlength="5" maxlength="50" autocomplete="off" required="true" autofocus><br> 
                            <small id="firstnameStat" class="display-none"><i></i></small><br> 
                            <label for="last-name">*Last Name</label><br>
                            <input class="tdl-input" type="text" id="lastName" name="lastName" minlength="3" maxlength="50" autocomplete="off" required="true"><br>
                            <small id="lastnameStat" class="display-none"><i></i></small><br>
                            <label for="email">*Email</label><br>
                            <input class="tdl-input" type="email" id="email" name="email" autocomplete="off" required="true"><br>
                            <small id="emailStat" class="display-none"><i></i></small><br>
                            <label for="password">*Password</label><br>
                            <input class="tdl-input" type="password" id="password" name="password" minlength="8" maxlength="60" required="true"><br>
                            <small id="passwordStat" class="display-none"><i></i></small><br>
                            <input type="submit" id="signUpPageSignUpButton" value="Sign Up">
                          </form>
                          <p id="alreadyAUser" class="text-center">
                            <small>Already a user?</small>
                            <a id="signUpPageLogInLink" href="#">Log In</a>
                          </p>
                          <small class="required"><i>* field required</i></small> 
                        </div>`;  
  } else {
    status.innerHTML = "Please log out the current user to sign up as a new user!";
    status.classList.remove("display-none");
    loadHomePage();
  }


  document.querySelector("#firstName").select(); // focus the firstName field on page load


  let status = document.querySelector("#status"); // get the status header


  const signUpForm = document.querySelector("#signUpForm"); // get the form element
  signUpForm.reset();


  const signUpButton = document.querySelector("#signUpPageSignUpButton"); // get the form button


  const logInLink = document.querySelector("#signUpPageLogInLink"); // get the log in link

  /*************************** SIGN UP BUTTON CLICK EVENT ************************** 
  * i.    Extract all values from the form and reset the form.                     *
  * ii.   Vertify password. Must be at least 8 characters. Must have at least one  *
  *       uppercase, one lowercase letter and a digit.                             *
  * iii.  Hash the password for security.                                          * 
  * iv.   Veify email. Must be a valid email format.                               *
  * v.    Hash the email as well to be used for stoing and retrieving user lists.  *
  * vi.   Verify the first and last name. Must be at least 5 and 3 digits long     *
  *       respectively. Must be only letters.                                      *
  * vii.  Store the information in the localStorage.                               *
  *************************** SIGN UP BUTTON CLICK EVENT **************************/ 

  signUpButton.addEventListener("click", (e) => {
    e.preventDefault();

    let stats = document.querySelectorAll(".stat-fail");

    for(const stat of stats) {
      resetStatus(stat);
    } 

    // reset status header
    resetStatus();

    let statusVal = status.innerHTML; // status header inner text will be stored in it 

    // i.    Extract all values from the form and reset the form.
    let firstName = document.querySelector("#firstName").value;
    let firstNameStat = document.querySelector("#firstNameStat");

    let lastName = document.querySelector("#lastName").value;
    let lastNameStat = document.querySelector("#lastNameStat");

    let email = document.querySelector("#email").value;
    let emailStat = document.querySelector("#emailStat");

    let password = document.querySelector("#password").value;
    let passwordStat = document.querySelector("#passwordStat");

    if (!(localStorage.getItem(email))) {

      const  user = {};

      // ii.    Vertify password. 
      let errors = verifyPassword(password);

      // errors is equal to true if no errors are found
      if (errors !== true) {
        statusVal += errors;
        passwordStat.innerHTML = errors;
        passwordStat.classList.add("stat-fail");
      } else {
        password = Sha512.hash(password);
        user.password = password;
      }

      // iii.   Verify email
      errors = verifyEmail(email);

      // errors is equal to true if no errors are found
      if (errors !== true) {
        statusVal += errors;
        emailStat.innerHTML = errors;
        emailStat.classList.add("stat-fail");
      } else {
        user.email = email;
        let emailHash = Sha512.hash(email);
        user.emailHash = emailHash;
      }

      // iv.   Verify first and last names
      errors = verifyNames(firstName, lastName);

      // errors is equal to true if no errors are found
      if (errors !== true) {
        statusVal += errors;
        if (errors.errorsFirst) {
          firstNameStat.innerHTML = errors.errorsFirst
          firstNameStat.classList.add("stat-fail");
        };
        if (errors.errorsLast) {
          lastNameStat.innerHTML = errors.errorsLast
          lastNameStat.classList.add("stat-fail");
        };
      } else {
        user.firstName = firstName;
        user.lastName = lastName;
      }
      if (statusVal === "") {
        status.innerHTML = "User created successfully!";
        status.classList.add("status-success");
        localStorage.setItem(email, JSON.stringify(user));
        localStorage.setItem(user.emailHash, JSON.stringify({}));
        loadLogInPage();
      }
    } else {
      emailStat.innerHTML = "user already exists!";
      emailStat.classList.add("stat-fail");
    }; // all the users must have unique email. if there is a user with a given email then raise error
  }); // signUpButton click event

  logInLink.addEventListener("click", (e) => {
    e.preventDefault();
    signUpForm.reset(); // dont keep these values
    loadLogInPage(); 
  });

  const homeHeading = document.querySelector("#homeHeadingLink");
  homeHeading.addEventListener("click", (e) => {
    e.preventDefault();
    loadHomePage();       
  });
} // loadSignUpPage

/************************** PASSWORD VERIFICATION FUNCTION *************************^* 
  Must be at least 8 characters. Must have at least one uppercase, one lowercase 
  letter and a digit.
*************************** PASSWORD VERIFICATION FUNCTION ***************************/
function verifyPassword(password) {
  let errors = ""; // this will store the errors found during verfication

  if(password.length < 8) {
    errors += "Password must have 8 characters at least!<br>";
  }

  if(!(/[a-z]+/g.test(password))) {
    errors += "Password must have at least one lowercase letter!<br>";
  }

  if(!(/[A-Z]+/g.test(password))) {
    errors += "Password must have at least one uppercase letter!<br>";
  }

  if(!(/[0-9]+/g.test(password))) {
    errors += "Password must have at least one digit!<br>";
  }

  if(!errors) {
    return true;
  } else {
    return errors;
  }
}; // veritfyPassword

/******************************* EMAIL VERIFICATION FUNCTION ************************^**** 
  Veify email. Must be a valid email format.
******************************** EMAIL VERIFICATION FUNCTION *****************************/
function verifyEmail(email) {
  let errors = ""; // this will store the errors found during verfication

  if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
    errors += "Please enter a valid email!<br>";
  }

  if(!errors) {
    return true;
  } else {
    return errors;
  }
}; // verifyEmail

/******************************* NAMES VERIFICATION FUNCTION ****************************^ 
  Verify the first and last name. Must be at least 5 and 3 digits long respectively. 
  Must be only letters.
******************************** NAMES VERIFICATION FUNCTION *****************************/
function verifyNames(firstName, lastName) {
  let errorsFirst = ""; // this will store the errors found during verfication
  let errorsLast = ""; // this will store the errors found during verfication

  if (firstName.length < 5) {
    errorsFirst += "First Name must have 5 letters at least<br>";
  }

  if (!(/^[a-zA-Z]+$/g.test(firstName))) {
    errorsFirst += "First Name can only have alphabets<br>";
  } 

  if (lastName.length < 3) {
    errorsLast += "Last Name must have 3 letters at least<br>";
  }

  if (!(/^[a-zA-Z]+$/g.test(lastName))) {
    errorsLast += "Last Name can only have alphabets<br>";
  }

  if(!errorsFirst && !errorsLast) {
    return true;
  } else {
    return {errorsFirst: errorsFirst, errorsLast: errorsLast};
  }
}; // verifyNames

function loadLogInPage() {
  hideAllContainers();

  const user = sessionStorage.getItem(1);

  resetStatus();


  const main = document.querySelector("#main");
  if (!user) {
    main.innerHTML +=  `<div id="logInDiv" class="container"> 
                        <h3 id="logInHeading" class="text-center">Log In</h3> 
                        <hr class="formHR"> 
                        <form id="logInForm" action="/#"> 
                          <label for="logInEmail">*Email</label><br> 
                          <input class="tdl-input" type="email" id="logInEmail" name="logInEmail"><br><br> 
                          <label for="logInPassword">*Password</label><br> 
                          <input class="tdl-input" type="password" id="logInPassword" name="logInPassword"><br><br> 
                          <input type="submit" id="logInPageLogInButton" value="Log In">
                        </form> 
                        <p id="alreadyAUser" class="text-center">
                          <small>Dont have an account yet?</small> 
                          <a id="logInPageSignUpButton" href="#">Sign Up</a> 
                        </p>
                      </div>`; 
  }


  const logInForm = document.querySelector("#logInForm"); // get the log in form
  logInForm.reset(); // reset the form at the time of loading the page


  const signUpLink = document.querySelector("#logInPageSignUpButton");


  let status = document.querySelector("#status"); // get the status header
  resetStatus();


  const logInButton = document.querySelector("#logInPageLogInButton");


  logInButton.addEventListener("click", (e) => {
    e.preventDefault();


    const email = document.querySelector("#logInEmail").value;
    let password = document.querySelector("#logInPassword");
    const passwordHash = Sha512.hash(password.value);
    password.value = "";

    const user = localStorage.getItem(email) ? JSON.parse(localStorage.getItem(email)) : false;

    if (user && user.password === passwordHash) {
      signIn(user); 
      loadUserDashboardPage(user);
    } else {
      status.innerHTML = "email or password are incorrect!"
      status.classList.add("status-fail"); 
    };
  }); // logInButton

  signUpLink.addEventListener("click", (e) => {
    e.preventDefault();
    logInForm.reset(); // dont keep these values
    loadSignUpPage(); 
  }); // signInLink
  const homeHeading = document.querySelector("#homeHeadingLink");
  homeHeading.addEventListener("click", (e) => {
    e.preventDefault();
    loadHomePage();     
  });
}; // loadLogInPage

function signOut() {
  hideAllContainers();


  sessionStorage.clear();


  let username = document.querySelector("#username"); 
  username.innerHTML = "";


  let header = document.querySelector("header");
  header.classList.add("display-none");


  let status = document.querySelector("#status"); // get the status header
  status.innerHTML = "User Signed Out";
  status.classList.add("status-success");


  resetUserDashboard();
  loadHomePage();
}; // signuot user

function signIn(user) {
  sessionStorage.setItem(1, JSON.stringify(user)); // set the user in the sessinoStorage


  let username = document.querySelector("#username"); 
  username.innerHTML = `Logged in as ${user.firstName} | <a id="signOutLink" href="">Log Out</a> | <a id="accountSettings" href="">Account Settings</a>`;
  

  const header = document.querySelector("header");
  header.classList.remove("display-none"); // display the header at the op of the page confirming the user first name and sign out option
  

  const signOutLink = document.querySelector("#signOutLink"); 
  signOutLink.addEventListener("click", (e) => {
    e.preventDefault();
    resetStatus();
    signOut();
  }); // signOutLink

  
  const accountSettings = document.querySelector("#accountSettings"); 
  accountSettings.addEventListener("click", (e) => {
    e.preventDefault();
    resetStatus();
    loadUserSettingsPage();
  }); // accountSettings


  let status = document.querySelector("#status"); // get the status header
  status.innerHTML = "Logged in successfully!";
  status.classList.add("status-success");
  setTimeout(() => {
    resetStatus(status);
  }, 30000); // reset status header after 30 seconds


  populateUserDashboard();
}; // sign in user

function loadUserDashboardPage() {
  const user = JSON.parse(sessionStorage.getItem(1));

  hideAllContainers();

  resetUserDashboard();

  populateUserDashboard();

  const createNewListButton = document.querySelector("#createNewListButton"); // get the create new list button
  createNewListButton.addEventListener("click", () => {
    loadUserListTasksPage();
  }); //createNewListButton click event
  const homeHeading = document.querySelector("#homeHeadingLink");
  homeHeading.addEventListener("click", (e) => {
    e.preventDefault();
    loadHomePage();      
  });
}; // loadUserDashboardPage

function populateUserDashboard() {
  resetUserDashboard();
  const user = JSON.parse(sessionStorage.getItem(1));

  const main = document.querySelector("#main");
  main.innerHTML += `<div id="userDashboardDiv" class="container">
                      <h2 id="userDashboardHeading" class="text-center">${user.firstName} ${user.lastName}'s Dashboard</h2>
                      <table id="userDashboardList" class="tdl-table">
                      </table>
                      <button id="createNewListButton" class="tdl-button">Create New List</button>
                    </div>`;         

  const userDashboardList = document.querySelector("#userDashboardList"); //  get the ordered lists from user dashboard
  // Get the user lists from the local storage
  // Populate the list on the page
  let userLists = localStorage.getItem(user.emailHash) ? JSON.parse(localStorage.getItem(user.emailHash)) : false;

  if (Object.keys(userLists).length !== 0) {
    let taableRow; 
    taableRow = `<tr> 
                   <th id="userDashboardSerialNumber" class="table-head user-list-serial">Sr. #</th> 
                   <th id="userDashboardListName" class="table-head user-list-name">List Name</th>
                 </tr>`;
    userDashboardList.innerHTML += taableRow;
    let count = 1;
    let clickEvent = null;
    let id = null;
    for (const list in userLists) {
      id = "userList"+count;
      taableRow = `<tr id="${id}" class="user-list">
                     <td id="${id}Serial" class="user-list-serial">List ${count}</td> 
                     <td id="${id}Name" class="user-list-name user-list-name-link"> 
                       ${userLists[list].name}
                     </td>
                  </tr>`; 
      userDashboardList.innerHTML += taableRow;
      count++;
    }

    let i = 0;
    for (const listId in userLists) {
      let clickEvents = document.querySelectorAll(".user-list");
      clickEvents[i].addEventListener("click", () => {
        loadUserListTasksPage(listId);
      });
      i++;
    }
  } else {
    userDashboardList.innerHTML += `<p class="text-center">You currently do not have any list. Create one now!</p>`;
  };
}; // populateUserDashboard

function resetUserDashboard() {
  const userDashboard = document.querySelector("#userDashboardDiv");
  if (userDashboard) {
    userDashboard.remove();
  };
}; // resetUserDashboard

function loadUserListTasksPage(listId = null) {
  const user = JSON.parse(sessionStorage.getItem(1));
  hideAllContainers(); // hide all containers


  const main = document.querySelector("#main");
  main.innerHTML += `<div id="userListTasksDiv" class="container">
                      <h2 id="userListTasksHeading" class="text-center"></h2>
                      <table id="userListTasksList" class="tdl-table">
                        <tr id="userListTasksHead" class="tdl-table-row">
                          <th class="user-list-tasks-serial">Sr. #</th>
                          <th class="user-list-tasks-name">Task Description</th>
                          <th class="user-list-tasks-status text-center">Status</th>
                        </tr>
                      </table>
                      <div id="taskButtons">
                        <button id="addNewTaskButton" class="tdl-button">Add New Task</button>
                        <button id="saveNewTaskButton" class="tdl-button">Save</button>
                        <button id="goToDashboard" class="tdl-button">User Dashboard</button>
                      </div>
                    </div>`;


  const status = document.querySelector("#status");
  let time = setTimeout(() => {
    resetStatus(); // reset the status header
  }, 6000);


  let userListTasksList = document.querySelector("#userListTasksList");


  const userListTasksHeading = document.querySelector("#userListTasksHeading"); // get the page heading
  const userLists = JSON.parse(localStorage.getItem(user.emailHash)); // get the user lsits from the localStorage


  let listName = null;
  let tasks = null;


  let taskCount = 0;  


  if (listId) {
    userListTasksHeading.innerHTML = userLists[listId].name;
    userListTasksHeading.innerHTML +=  ` <small><a id="editListName" href="#">Edit</a></small>`;
    listName = userLists[listId].name;
    tasks = userLists[listId].tasks;

    const editListName = document.querySelector("#editListName");
    editListName.addEventListener("click", (e) => {
      e.preventDefault();
      userListTasksHeading.innerHTML = `<input id="listName" type="text" placeholder="Enter list name here" value="${userLists[listId].name}">`;
    });
    if (tasks.length !== 0) {
      for (const task of tasks) {
        taskCount++;
        addTaskToTable(taskCount, task);
      }
    } else {
      taskCount++;
      addTaskToTable(taskCount);
    }; // see if there is any task in the list otherwise add an input field for new task
  } else {
    userListTasksHeading.innerHTML = `<input id="listName" type="text" placeholder="Enter list name here">`;
    taskCount++;
    addTaskToTable(taskCount);
  };


  const addNewTaskButton = document.querySelector("#addNewTaskButton");
  addNewTaskButton.addEventListener("click", (e) => {
    e.preventDefault();
    taskCount++;
    addTaskToTable(taskCount);
  }); // addNewTaskButton


  // i.   Update the list name in the display and in the userLists  
  // ii.  Update the status of the tasks in the list as wel
  // iii. Update the new entries on the display and then in the list as well 
  // iv.  Update the userLists in the localStorage
  const saveNewTaskButton = document.querySelector("#saveNewTaskButton");
  saveNewTaskButton.addEventListener("click", (e) => {
    e.preventDefault();
    let innerHTML = "";

    // i.   Update the list name in the display and in the userLists 
    listName = document.querySelector("#listName") ? document.querySelector("#listName").value : userListTasksHeading.innerHTML.split("<small>")[0];
    let tasksStatLen = 0;
    if (!listId) {
      listId = Date.now();
      userLists[listId] = {};
      userLists[listId].tasks = []; 
      innerHTML = "List created successfully!";
    } else {
      if (tasks.length !== 0) {
        let tasksStat = document.querySelectorAll("input[type=\"checkbox\"]"); //  get the status of the current tasks
        tasksStatLen = tasksStat.length;
        for(let t = 0; t < tasksStatLen; t++) { // update the statuses of the tasks in the list
          if (tasksStat[t].checked) {
            userLists[listId].tasks[t][1] = 1;
          } else {
            userLists[listId].tasks[t][1] = 0;
          };
        } // this will only be required if list already exists otherwise there is no use i.e update the status of tasks
      }
      innerHTML = "List updated successfully!";
    }; 
    userLists[listId].name = listName; // update the lsit name if it has been updated in the list as well

    // ii.  Update the status of the tasks in the list as wel

    // iii. Update the new entries on the display and then in the list as well 
    const newTasks = document.querySelectorAll(".user-list-task-name-input"); // get all the new values
    const newTasksLen = newTasks.length;
    let newTaskValue = null;
    for (var i = 0; i < newTasksLen; i++) {
      newTaskValue = [newTasks[i].value, 0]; // store the value to the temporary variable
      if (newTaskValue[0].split(" ").join("") !== "") {
        tasksStatLen++;
        userLists[listId].tasks.push(newTaskValue); // update the list as well
      } else {
        newTasks[i].parentNode.parentNode.parentNode.remove(); // remove the element
        taskCount--; // decrement the taskCounter
      };
    };

    if (userLists[listId].name.split(" ").join("") !== "") {
      localStorage.setItem(user.emailHash, JSON.stringify(userLists)); // store the userLists back to the localStorage
      clearTimeout(time);
      resetStatus();
      status.innerHTML = innerHTML;
      status.classList.add("status-success");
      loadUserListTasksPage(listId);
    } else {
      clearTimeout(time);
      resetStatus();
      status.innerHTML = "No list name is entered";
      status.classList.add("status-fail");
      delete userLists[listId];
      listId = null;
      loadUserListTasksPage(); 
    }; // userLists[listId].name is present then procedd and save it to localStorage
    // loadUserDashboardPage();
  }); // saveNewTaskButon click event


  const goToDashboard = document.querySelector("#goToDashboard");
  goToDashboard.addEventListener("click", (e) => {
    e.preventDefault();
    clearTimeout(time);
    loadUserDashboardPage();
  });
  const homeHeading = document.querySelector("#homeHeadingLink");
  homeHeading.addEventListener("click", (e) => {
    e.preventDefault();
    loadHomePage();       
  });
}; // loadUserListTasksPage

function addTaskToTable(taskCount, task = null) {
  const userListTasksList = document.querySelector("#userListTasksList");
  if (task) {

    userListTasksList.innerHTML +=   `<tr id="userListTasksHead" class="tdl-table-row">
                                        <td class="user-list-task-serial text-center">Task ${taskCount}</td> 
                                        <td class="user-list-task-name"> ${task[0]}</td> 
                                        <td class="user-list-task-status text-center"> 
                                          <label class="label-container"> 
                                            <input type="checkbox" class="user-list-task-status-input" name="userListTask${taskCount}"  
                                             ${(task[1] ? checked="checked" : "none")}> 
                                            <span class="user-list-task-status-input-checkmark"></span> 
                                          </label>
                                        </td> 
                                      </tr>`;
  } else {

    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    tr.id = "userListTasksHead";
    tr.classList += "tdl-table-row";
    let tdSerial = document.createElement('td');
    tdSerial.innerHTML = `Task ${taskCount}`;
    tdSerial.classList += "user-list-task-serial text-center";
    let tdName = document.createElement('td');
    tdName.classList += "user-list-task-name text-center";
    let tdStatus = document.createElement('td');
    tdStatus.classList += "user-list-task-status text-center";
    let tdNameInput = document.createElement('input');
    tdNameInput.type = "text";
    tdNameInput.classList += "user-list-task-name-input";
    tdNameInput.name = `userListTask${taskCount}`;
    tdNameInput.placeholder = "Enter task description here";

    tdName.appendChild(tdNameInput);
    tr.appendChild(tdSerial);
    tr.appendChild(tdName);
    tr.appendChild(tdStatus);
    tbody.appendChild(tr);

    console.log(tr, "\n", tdSerial, "\n", tdName, "\n", tdStatus, "\n", tdNameInput);

    userListTasksList.appendChild(tbody);
  }   
}; // add task to table function

function loadUserSettingsPage() {
  hideAllContainers();
  const user = JSON.parse(sessionStorage.getItem(1));

  const main = document.querySelector("#main");
  main.innerHTML += `<div id="userAccountSettingsDiv" class="container"> 
                        <h2 id="userAccountSettingsHeading" class="text-center">${user.firstName} ${user.lastName}'s Account Settings</h2> 
                        <h3 id="userAccountSettingsDesc" class="text-center">Update your account settings here!</h3> 
                        <hr class="formHR"> 
                        <form id="updateUserInfoForm" action="/#"> 
                          <label for="first-name">*First Name</label><br> 
                          <input class="tdl-input" type="text" id="firstName" name="firstName" minlength="5" maxlength="50" value="${user.firstName}" autocomplete="off" required="true" autofocus><br> 
                          <small id="firstnameStat" class="display-none"><i></i></small><br> 
                          <label for="last-name">*Last Name</label><br>
                          <input class="tdl-input" type="text" id="lastName" name="lastName" minlength="3" maxlength="50" value="${user.lastName}" autocomplete="off" required="true"><br>
                          <small id="lastnameStat" class="display-none"><i></i></small><br>
                          <label for="email">*Email</label><br>
                          <input class="tdl-input" type="email" id="email" name="email" value="${user.email}" autocomplete="off" required="true"><br>
                          <small id="emailStat" class="display-none"><i></i></small><br>
                          <label for="newPassword">*New Password</label><br>
                          <input class="tdl-input" type="password" id="newPassword" name="newPassword" minlength="8" maxlength="60"><br>
                          <small id="newPasswordStat" class="display-none"><i></i></small><br>
                          <label for="currentPassword">*Current Password</label><br>
                          <input class="tdl-input" type="password" id="currentPassword" name="currentPassword" minlength="8" maxlength="60" required="true"><br>
                          <small id="currentPasswordStat" class="display-none"><i></i></small><br>
                          <input type="submit" id="userAccountSettingsPageUpdateButton" value="Update Info">
                        </form> 
                    </div>`;


  document.querySelector("#firstName").select(); // focus the firstName field on page load


  let status = document.querySelector("#status"); // get the status header


  const updateUserInfoForm = document.querySelector("#updateUserInfoForm"); // get the form element
  updateUserInfoForm.reset();


  const updateInfoButton = document.querySelector("#userAccountSettingsPageUpdateButton"); // get the form button


  /*************************** SIGN UP BUTTON CLICK EVENT ************************** 
  * i.    Extract all values from the form and reset the form.                     *
  * ii.   Vertify password. Must be at least 8 characters. Must have at least one  *
  *       uppercase, one lowercase letter and a digit.                             *
  * iii.  Hash the password for security.                                          * 
  * iv.   Veify email. Must be a valid email format.                               *
  * v.    Hash the email as well to be used for stoing and retrieving user lists.  *
  * vi.   Verify the first and last name. Must be at least 5 and 3 digits long     *
  *       respectively. Must be only letters.                                      *
  * vii.  Store the information in the localStorage.                               *
  *************************** SIGN UP BUTTON CLICK EVENT **************************/ 

  updateInfoButton.addEventListener("click", (e) => {
    e.preventDefault();

    let stats = document.querySelectorAll(".stat-fail");

    for(const stat of stats) {
      resetStatus(stat);
    } 

    // reset status header
    resetStatus();

    let statusVal = status.innerHTML; // status header inner text will be stored in it 

    // i.    Extract all values from the form and reset the form.
    let firstName = document.querySelector("#firstName").value;
    let firstNameStat = document.querySelector("#firstNameStat");

    let lastName = document.querySelector("#lastName").value;
    let lastNameStat = document.querySelector("#lastNameStat");

    let email = document.querySelector("#email").value;
    let emailStat = document.querySelector("#emailStat");

    let newPassword = document.querySelector("#newPassword").value;
    let newPasswordStat = document.querySelector("#newPasswordStat");

    let currentPassword = document.querySelector("#currentPassword").value;
    let currentPasswordStat = document.querySelector("#currentPasswordStat");


    if (email === user.email || !(localStorage.getItem(email))) {
      if (Sha512.hash(currentPassword) === user.password) {
        if (newPassword && Sha512.hash(newPassword) !== user.password) {
          // ii.    Vertify password. 
          let errors = verifyPassword(newPassword);

          // errors is equal to true if no errors are found
          if (errors !== true) {
            statusVal += errors;
            newPasswordStat.innerHTML = errors;
            newPasswordStat.classList.add("stat-fail");
          } else {
            newPassword = Sha512.hash(newPassword);
            user.password = newPassword;
          }
        }

        if (email !== user.email) {
          // iii.   Verify email
          errors = verifyEmail(email);

          // errors is equal to true if no errors are found
          if (errors !== true) {
            statusVal += errors;
            emailStat.innerHTML = errors;
            emailStat.classList.add("stat-fail");
          } else {
            const userLists = localStorage.getItem(user.emailHash);
            localStorage.removeItem(user.emailHash);
            localStorage.removeItem(user.email);
            user.email = email;
            let emailHash = Sha512.hash(email);
            user.emailHash = emailHash;
            localStorage.setItem(user.emailHash, userLists);
          }
        };

        if ((firstName && lastName) && (firstName !== user.firstName || lastName !== user.lastName)) {
          // iv.   Verify first and last names
          errors = verifyNames(firstName, lastName);

          // errors is equal to true if no errors are found
          if (errors !== true) {
            statusVal += errors;
            if (errors.errorsFirst) {
              firstNameStat.innerHTML = errors.errorsFirst
              firstNameStat.classList.add("stat-fail");
            };
            if (errors.errorsLast) {
              lastNameStat.innerHTML = errors.errorsLast
              lastNameStat.classList.add("stat-fail");
            };
          } else {
            user.firstName = firstName;
            user.lastName = lastName;
          }
        }
        if (statusVal === "") {
          status.innerHTML = "User updated successfully!";
          status.classList.add("status-success");
          localStorage.setItem(email, JSON.stringify(user));
          signOut();
          loadLogInPage();
        }
      } else {
        status.innerHTML = "Current password does not match the current user passowrd!";
        status.classList.add("status-fail");
      }; // if currentPassword matches the one in the sessionStorage
    } else { // unique email if statement
      emailStat.innerHTML = "user already exists!";
      emailStat.classList.add("stat-fail");
    }; // all the users must have unique email. if there is a user with a given email then raise error
  }); // updateInfoButton click event
  const homeHeading = document.querySelector("#homeHeadingLink");
  homeHeading.addEventListener("click", (e) => {
    e.preventDefault();
    loadHomePage();        
  });
} // loadUserSettingsPage

/******************************* GENERAL PURPOSE FUNCTIONS ********************************/ 
function hideAllContainers() {
  let containers = document.querySelectorAll(".container");
  for (const container of containers) {
    if (container.id !== "userDashboardDiv") {
      container.remove();
    } else {
      container.classList.add("display-none");
    }
  }
}; // hide all containers - general purpose function

function insertAfter(element, previoustSiblig) {
  previoustSiblig.parentNode.insertBefore(element, previoustSiblig.nextSiblig);
} // insert a node after a certain node

// reset status header
function resetStatus(status) {
  status ||= document.querySelector("#status"); // get the status header

  status.innerHTML = "";
  status.classList.remove("status-fail"); 
  status.classList.remove("stat-fail"); 
  status.classList.remove("status-success"); 
} // resetStatus
/******************************* GENERAL PURPOSE FUNCTIONS ********************************/ 

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
* SHA-512 (FIPS 180-4) implementation in JavaScript                  
* (c) Chris Veness 2016-2019  
* www.movable-type.co.uk/scripts/sha512.html                                                     
* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/**
 * SHA-512 hash function reference implementation.
 *
 * This is an annotated direct implementation of FIPS 180-4, without any optimisations. It is
 * intended to aid understanding of the algorithm rather than for production use.
 *
 * While it could be used where performance is not critical, I would recommend using the ‘Web
 * Cryptography API’ (developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) for the browser,
 * or the ‘crypto’ library (nodejs.org/api/crypto.html#crypto_class_hash) in Node.js.
 *
 * SHA-512 is more difficult to implement in JavaScript than SHA-256, as it is based on 64-bit
 * (unsigned) integers, which are not natively supported in JavaScript (in which all numbers are
 * IEEE 754 64-bit floating-point numbers). A 'Long' library here provides UInt64-style support.
 *
 * See csrc.nist.gov/groups/ST/toolkit/secure_hashing.html
 *     csrc.nist.gov/groups/ST/toolkit/examples.html
 */
class Sha512 {

    /**
     * Generates SHA-512 hash of string.
     *
     * @param   {string} msg - (Unicode) string to be hashed.
     * @param   {Object} [options]
     * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
     *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' = 'abc') .
     * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
     *   hex bytes; 'hex-w' for grouping hex bytes into groups of (8 byte / 16 character) words.
     * @returns {string} Hash of msg as hex character string.
     *
     * @example
     *   import Sha512 from './sha512.js';
     *   const hash = Sha512.hash('abc'); // 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
     */
    static hash(msg, options) {
        const defaults = { msgFormat: 'string', outFormat: 'hex' };
        const opt = Object.assign(defaults, options);

        switch (opt.msgFormat) {
            default: // default is to convert string to UTF-8, as SHA only deals with byte-streams
            case 'string':   msg = utf8Encode(msg);       break;
            case 'hex-bytes':msg = hexBytesToString(msg); break; // mostly for running tests
        }

        // constants [§4.2.3]
        const K = [
            '428a2f98d728ae22', '7137449123ef65cd', 'b5c0fbcfec4d3b2f', 'e9b5dba58189dbbc',
            '3956c25bf348b538', '59f111f1b605d019', '923f82a4af194f9b', 'ab1c5ed5da6d8118',
            'd807aa98a3030242', '12835b0145706fbe', '243185be4ee4b28c', '550c7dc3d5ffb4e2',
            '72be5d74f27b896f', '80deb1fe3b1696b1', '9bdc06a725c71235', 'c19bf174cf692694',
            'e49b69c19ef14ad2', 'efbe4786384f25e3', '0fc19dc68b8cd5b5', '240ca1cc77ac9c65',
            '2de92c6f592b0275', '4a7484aa6ea6e483', '5cb0a9dcbd41fbd4', '76f988da831153b5',
            '983e5152ee66dfab', 'a831c66d2db43210', 'b00327c898fb213f', 'bf597fc7beef0ee4',
            'c6e00bf33da88fc2', 'd5a79147930aa725', '06ca6351e003826f', '142929670a0e6e70',
            '27b70a8546d22ffc', '2e1b21385c26c926', '4d2c6dfc5ac42aed', '53380d139d95b3df',
            '650a73548baf63de', '766a0abb3c77b2a8', '81c2c92e47edaee6', '92722c851482353b',
            'a2bfe8a14cf10364', 'a81a664bbc423001', 'c24b8b70d0f89791', 'c76c51a30654be30',
            'd192e819d6ef5218', 'd69906245565a910', 'f40e35855771202a', '106aa07032bbd1b8',
            '19a4c116b8d2d0c8', '1e376c085141ab53', '2748774cdf8eeb99', '34b0bcb5e19b48a8',
            '391c0cb3c5c95a63', '4ed8aa4ae3418acb', '5b9cca4f7763e373', '682e6ff3d6b2b8a3',
            '748f82ee5defb2fc', '78a5636f43172f60', '84c87814a1f0ab72', '8cc702081a6439ec',
            '90befffa23631e28', 'a4506cebde82bde9', 'bef9a3f7b2c67915', 'c67178f2e372532b',
            'ca273eceea26619c', 'd186b8c721c0c207', 'eada7dd6cde0eb1e', 'f57d4f7fee6ed178',
            '06f067aa72176fba', '0a637dc5a2c898a6', '113f9804bef90dae', '1b710b35131c471b',
            '28db77f523047d84', '32caab7b40c72493', '3c9ebe0a15c9bebc', '431d67c49c100d4c',
            '4cc5d4becb3e42b6', '597f299cfc657e2a', '5fcb6fab3ad6faec', '6c44198c4a475817',
        ].map(k => Sha512.Long.fromString(k));

        // initial hash value [§5.3.5]
        const H = [
            '6a09e667f3bcc908', 'bb67ae8584caa73b', '3c6ef372fe94f82b', 'a54ff53a5f1d36f1',
            '510e527fade682d1', '9b05688c2b3e6c1f', '1f83d9abfb41bd6b', '5be0cd19137e2179',
        ].map(h => Sha512.Long.fromString(h));

        // PREPROCESSING [§6.4.1]

        msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.2]

        // convert string msg into 1024-bit blocks (array of 16 uint64) [§5.2.2]
        const l = msg.length/8 + 2; // length (in 64-bit longs) of msg + ‘1’ + appended length
        const N = Math.ceil(l/16);  // number of 16-long (1024-bit) blocks required to hold 'l' ints
        const M = new Array(N);     // message M is N×16 array of 64-bit integers

        for (let i=0; i<N; i++) {
            M[i] = new Array(16);
            for (let j=0; j<16; j++) { // encode 8 chars per uint64 (128 per block), big-endian encoding
                const lo = (msg.charCodeAt(i*128+j*8+0)<<24) | (msg.charCodeAt(i*128+j*8+1)<<16)
                         | (msg.charCodeAt(i*128+j*8+2)<< 8) | (msg.charCodeAt(i*128+j*8+3)<< 0);
                const hi = (msg.charCodeAt(i*128+j*8+4)<<24) | (msg.charCodeAt(i*128+j*8+5)<<16)
                         | (msg.charCodeAt(i*128+j*8+6)<< 8) | (msg.charCodeAt(i*128+j*8+7)<< 0);
                M[i][j] = new Sha512.Long(lo, hi);
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        }
        // add length (in bits) into final pair of 64-bit integers (big-endian) [§5.1.2]
        M[N-1][14] = new Sha512.Long(0, 0); // tooo hard... limit msg to 2 million terabytes
        // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
        // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
        const lenHi = ((msg.length-1)*8) / Math.pow(2, 32);
        const lenLo = ((msg.length-1)*8) >>> 0; // note '>>> 0' coerces number to unsigned 32-bit integer
        M[N-1][15] = new Sha512.Long(Math.floor(lenHi), lenLo);


        // HASH COMPUTATION [§6.4.2]

        for (let i=0; i<N; i++) {
            const W = new Array(80);

            // 1 - prepare message schedule 'W'
            for (let t=0;  t<16; t++) W[t] = M[i][t];
            for (let t=16; t<80; t++) {
                W[t] = (Sha512.s1(W[t-2]).add(W[t-7]).add(Sha512.s0(W[t-15])).add(W[t-16]));
            }

            // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
            let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

            // 3 - main loop (note 'addition modulo 2^64')
            for (let t=0; t<80; t++) {
                const T1 = h.add(Sha512.S1(e)).add(Sha512.Ch(e, f, g)).add(K[t]).add(W[t]);
                const T2 = Sha512.S0(a).add(Sha512.Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = d.add(T1);
                d = c;
                c = b;
                b = a;
                a = T1.add(T2);
            }

            // 4 - compute the new intermediate hash value
            H[0] = H[0].add(a);
            H[1] = H[1].add(b);
            H[2] = H[2].add(c);
            H[3] = H[3].add(d);
            H[4] = H[4].add(e);
            H[5] = H[5].add(f);
            H[6] = H[6].add(g);
            H[7] = H[7].add(h);
        }

        // convert H0..H7 to hex strings (with leading zeros)
        for (let h=0; h<H.length; h++) H[h] = H[h].toString();

        // concatenate H0..H7, with separator if required
        const separator = opt.outFormat=='hex-w' ? ' ' : '';

        return H.join(separator);

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

        function utf8Encode(str) {
            try {
                return new TextEncoder().encode(str, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '');
            } catch (e) { // no TextEncoder available?
                return unescape(encodeURIComponent(str)); // monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
            }
        }

        function hexBytesToString(hexStr) { // convert string of hex numbers to a string of chars (eg '616263' -> 'abc').
            const str = hexStr.replace(' ', ''); // allow space-separated groups
            return str=='' ? '' : str.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        }
    }


    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     * @private
     */
    static ROTR(x, n) { // emulates (x >>> n) | (x << (64-n)
        if (n == 0) return x;
        if (n == 32) return new Sha512.Long(x.lo, x.hi);

        let hi = x.hi, lo = x.lo;

        if (n > 32) {
            [ lo, hi ] = [ hi, lo ]; // swap hi/lo
            n -= 32;
        }

        const hi1 = (hi >>> n) | (lo << (32-n));
        const lo1 = (lo >>> n) | (hi << (32-n));

        return new Sha512.Long(hi1, lo1);
    }


    /**
     * Logical functions [§4.1.3].
     * @private
     */
    static S0(x) { return Sha512.ROTR(x, 28).xor(Sha512.ROTR(x, 34)).xor(Sha512.ROTR(x, 39)); }
    static S1(x) { return Sha512.ROTR(x, 14).xor(Sha512.ROTR(x, 18)).xor(Sha512.ROTR(x, 41)); }
    static s0(x) { return Sha512.ROTR(x,  1).xor(Sha512.ROTR(x,  8)).xor(x.shr(7)); }
    static s1(x) { return Sha512.ROTR(x, 19).xor(Sha512.ROTR(x, 61)).xor(x.shr(6)); }
    static Ch(x, y, z)  { return (x.and(y)).xor(x.not().and(z)); }         // 'choice'
    static Maj(x, y, z) { return (x.and(y)).xor(x.and(z)).xor(y.and(z)); } // 'majority'
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * JavaScript has no support for 64-bit integers; this class provides methods required to support
 * 64-bit unsigned integers within Sha256.
 *
 * All string manipulation is radix 16. Note n >>> 0 coerces n to unsigned 32-bit value.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
Sha512.Long = class {

    constructor(hi, lo) {
        this.hi = hi >>> 0;
        this.lo = lo >>> 0;
    }

    static fromString(str) {
        const hi = parseInt(str.slice(0, -8), 16);
        const lo = parseInt(str.slice(-8), 16);

        return new Sha512.Long(hi, lo);
    }

    toString() {
        const hi = ('00000000'+this.hi.toString(16)).slice(-8);
        const lo = ('00000000'+this.lo.toString(16)).slice(-8);

        return hi + lo;
    }

    add(that) { // addition modulo 2^64
        const lo = this.lo + that.lo;
        const hi = this.hi + that.hi + (lo>0x100000000 ? 1 : 0); // carry top bit if lo > 2^32

        return new Sha512.Long(hi >>> 0, lo >>> 0);
    }

    and(that) { // &
        return new Sha512.Long(this.hi & that.hi, this.lo & that.lo);
    }

    xor(that) { // ^
        return new Sha512.Long(this.hi ^ that.hi, this.lo ^ that.lo);
    }

    not() {  // ~
        return new Sha512.Long(~this.hi, ~this.lo);
    }

    shr(n) { // >>>
        if (n ==  0) return this;
        if (n == 32) return new Sha512.Long(0, this.hi);
        if (n >  32) return new Sha512.Long(0, this.hi >>> n-32);
        /* n < 32 */ return new Sha512.Long(this.hi >>> n, this.lo >>> n | this.hi << (32-n));
    }
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */  