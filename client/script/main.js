$(document).ready(() => {
  auth()

  $("#btnRegister").on("click", () => {
    showRegister();
  })
  $("#btnLogin").on("click", () => {
    auth();
  })
  $("#btn-finished-todos").on("click", () => {
    showMyFinishedTodos();
  })
  $("#btn-mytodos").on("click", () => {
    auth();
  })
  $("#btn-add-todo").on("click", () => {
    showAddTodo();
  })
  $("#logoutNav").on("click", () => {
    logout();
    auth();
  })

  $("#formLogin").on("submit", (e) => {
    e.preventDefault();
    login();
  })
  $("#formRegister").on("submit", (e) => {
    e.preventDefault();
    register();
  })
  $("#formAddTodo").on("submit", (e) => {
    e.preventDefault();
    addTodo();
  })
  $("#formEditTodo").on("submit", (e) => {
    e.preventDefault();
    editSubmit(idEdit);
  })
});