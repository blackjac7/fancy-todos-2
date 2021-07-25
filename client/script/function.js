const baseUrl = "http://localhost:3000/";
let idEdit;

function formatDateCE(date){
  const d = new Date(date)
  let month = String((d.getMonth() + 1))
  let day = String(d.getDate())
  let year = String(d.getFullYear())

  if (month.length < 2) 
    month = '0' + month
  if (day.length < 2) 
    day = '0' + day

  return [year, month, day].join('-')
}

function formatDateR(date){
  const d = new Date(date)
  let month = String((d.getMonth() + 1))
  let day = String(d.getDate())
  let year = String(d.getFullYear())

  if (month.length < 2) 
    month = '0' + month
  if (day.length < 2) 
    day = '0' + day

  return [day, month, year].join('-')
}

function onSignIn(googleUser) {
  // var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  let id_token = googleUser.getAuthResponse().id_token;
  // console.log(id_token);

  $.ajax({
    method: "POST",
    url: baseUrl + "users/google-login",
    data: {
      googleToken: id_token
    }
  })
    .done(response => {
      localStorage.setItem("access_token", response.access_token)
      auth();
    })
    .fail((xhr, textStatus) => {
      console.log(xhr, textStatus);
    })
}

function auth(){
  if (!localStorage.getItem("access_token")){
    $("#loginPage").show();
    $("#registerPage").hide();
    $("#navbarPage").hide();
    $("#myTodosPage").hide();
    $("#myFinishedTodosPage").hide();
    $("#addTodoPage").hide();
    $("#editTodoPage").hide();
  }else {
    $("#loginPage").hide();
    $("#registerPage").hide();
    $("#navbarPage").show();
    $("#myTodosPage").show();
    $("#myFinishedTodosPage").hide();
    $("#addTodoPage").hide();
    $("#editTodoPage").hide();
    getUserTodos();
  }
}

function showRegister(){
  $("#loginPage").hide();
  $("#registerPage").show();
  $("#navbarPage").hide();
  $("#myTodosPage").hide();
  $("#myFinishedTodosPage").hide();
  $("#addTodoPage").hide();
  $("#editTodoPage").hide();
}

function showMyFinishedTodos(){
  $("#loginPage").hide();
  $("#registerPage").hide();
  $("#navbarPage").show();
  $("#myTodosPage").hide();
  $("#myFinishedTodosPage").show();
  $("#addTodoPage").hide();
  $("#editTodoPage").hide();

  getFinishedTodo();
}

function showAddTodo(){
  $("#loginPage").hide();
  $("#registerPage").hide();
  $("#navbarPage").show();
  $("#myTodosPage").hide();
  $("#myFinishedTodosPage").hide();
  $("#addTodoPage").show();
  $("#editTodoPage").hide();
}

function showEditTodo(){
  $("#loginPage").hide();
  $("#registerPage").hide();
  $("#navbarPage").show();
  $("#myTodosPage").hide();
  $("#myFinishedTodosPage").hide();
  $("#addTodoPage").hide();
  $("#editTodoPage").show();
}

function login(){
  const email = $("#logEmail").val();
  const password = $("#logPassword").val();

  $.ajax({
    method: "POST",
    url: baseUrl + "users/login",
    data: {
      email,
      password
    }
  })
  .done(response => {
    localStorage.setItem("access_token", response.access_token)
    auth();
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
  .always(_ => {
    // $("#logEmail").val("");
    // $("#logPassword").val("");

    $("#formLogin").trigger("reset");
  })
}

function logout(){
  // localStorage.removeItem('access_token'); 
  localStorage.clear();
  const auth2 = gapi.auth2.getAuthInstance();
  
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function register(){
  const name = $("#regName").val();
  const email = $("#regEmail").val();
  const password = $("#regPassword").val();

  $.ajax({
    method: "POST",
    url: baseUrl + "users/register",
    data: {
      name,
      email,
      password
    }
  })
  .done(response => {
    console.log(response)
    auth();
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
  .always(_ => {
    // $("#regEmail").val("");
    // $("#regPassword").val("");

    $("#formRegister").trigger("reset");
  })
}

function getUserTodos(){ 
  $.ajax({
    method: "GET",
    url: baseUrl + "todos/",
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
  .done(todos => {
    $("#myTodoList").empty()
    todos.forEach(el => {
      $("#myTodoList").append(`
      <div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${el.title}</h5>
          <p class="card-text">${el.description}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${formatDateR(el.due_date)}</li>
        </ul>
        <div class="card-body">
          <button onclick="doneBtn(${el.id})" class="btn btn-primary" type="button">Done</button>
          <button onclick="editPage(${el.id})" class="btn btn-warning" type="button">Edit</button>
        </div>
      </div>
      `)
    })
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
}

function getFinishedTodo(){
  $.ajax({
    method: "GET",
    url: baseUrl + `todos/finished`,
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
  .then(todos => {
    $("#myFinishedTodo").empty()
    todos.forEach(el => {
      $("#myFinishedTodo").append(`
      <div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${el.title}</h5>
          <p class="card-text">${el.description}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${formatDateR(el.due_date)}</li>
        </ul>
        <div class="card-body">
          <button onclick="deleteTodo(${el.id})" class="btn btn-outline-danger" type="button" name="deleteTodo">Delete</button>
        </div>
      </div>
      `)
    })
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
}

function addTodo(){
  const title = $("#addTodoTitle").val()
  const description = $("#addTodoDesc").val()
  const due_date = $("#addTodoDueDate").val()

  $.ajax({
    method: "POST",
    url: baseUrl + `todos/`,
    headers: {
      token: localStorage.getItem("access_token")
    },
    data: {
      title,
      description,
      due_date
    }
  })
  .done(todo => {
    auth();
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
}

function editPage(id){
  idEdit = id;

  $.ajax({
    method: "GET",
    url: baseUrl + `todos/${idEdit}`,
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
  .done(todo => {
    $("#editTodoTitle").val(todo.title)
    $("#editTodoDesc").val(todo.description)
    $("#editTodoDueDate").val(formatDateCE(todo.due_date))
    showEditTodo();
    
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus)
  })
}

function editSubmit(idEdit){
  const title = $("#editTodoTitle").val()
  const description = $("#editTodoDesc").val()
  const due_date = $("#editTodoDueDate").val()

  $.ajax({
    method: "PUT",
    url: baseUrl + `todos/${idEdit}`,
    headers: {
      token: localStorage.getItem("access_token")
    },
    data: {
      title,
      description,
      due_date
    }
  })
  .done(todo => {
    auth()
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
}

function doneBtn(id){
  $.ajax({
    method: "PATCH",
    url: baseUrl + `todos/${id}`,
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
  .done(response => {
    auth()
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
}

function deleteTodo(id){
  $.ajax({
    method: "DELETE",
    url: baseUrl + `todos/${id}`,
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
  .done(response => {
    showMyFinishedTodos()
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus);
  })
}