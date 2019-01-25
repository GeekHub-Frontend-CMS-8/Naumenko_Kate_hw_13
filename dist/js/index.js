let setCompletedStatus, deleteItem, editItem, setTodos = null;

jQuery(function ($) {
  let todos = [];
  let list = $('.todos');
  let form = $('.form');

  setTodos = (todosList) => {
    window.localStorage.setItem('todos', JSON.stringify(todosList));
  };

  addTodo = (name) => {
    let objProperties = { title: name, completed: false, id: todos.length + 1 };
    todos.push(objProperties);
    window.localStorage.setItem('todos', JSON.stringify(todos));
    rerenderList();
  };

  setCompletedStatus = (id) => {
    let todosList = todos.map((t) => {
      if (t.id === id) {
        t.completed = !t.completed;
      }
      return t;
    });
    setTodos(todosList);
  };

  deleteItem = (id) => {
    let todo = todos.filter((t) => t.id === id)[0];

    if (confirm('Видалити: ' + todo.title + '?')) {
      let todosList = todos.filter((t) => t.id !== id);
      setTodos(todosList);
      rerenderList();
    }
  };

  editItem = (id) => {
    let todo = todos.filter((t) => t.id === id)[0];
    let li = $(`li.item-${id}`);
    let editLink = li.find('a[data-edit~=false]');

    if (editLink.length > 0) {
      li.find('.list-item__content').hide();
      li.find('input').show();
      editLink.text('Save');
      editLink.attr('data-edit', true);
    } else {
      let input = li.find('input.text');

      let todosList = todos.map((t) => {
        if (t.id === id) {
          t.title = input.val();
        }
        return t;
      });
      setTodos(todosList);
      rerenderList();
    }
  };

  rerenderList = () => {
    storedTodos = window.localStorage.getItem('todos');
    storedTodos = JSON.parse(storedTodos);
    list.html('');

    if (storedTodos && storedTodos.length > 0) {
      todos = storedTodos;
      storedTodos.map((todo) => {
        return list.append(`<li class="item-${todo.id} list-item"><div class="list-item__content">` + todo.title + `</div><input class="text list-item__edit" value="${todo.title}" style="display: none;">` + renderActions(todo) + '</li>');
      });
    }
  };

  renderActions = (todo) => {
    return `
      <a href='javascript:void(0)' data-edit=${false} onclick="editItem(${todo.id})" class="btn link list-item__btn">Edit</a>
      <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="setCompletedStatus(${todo.id})" class="checkbox">
      <a href='javascript:void(0)' onclick="deleteItem(${todo.id})" class="btn link list-item__btn">Delete</a>
    `;
  };

  form.on('submit', function (e) {
    e.preventDefault();
    addTodo($(this).find('input#todo').val());
    this.reset();
  });

  $('.load-more').on('click', function() {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/todos"
    }).done((response) => {
      let todos = response.slice(0, 5);
      let storedTodos = window.localStorage.getItem('todos');
      setTodos([...(storedTodos ? JSON.parse(storedTodos) : []), ...todos]);
      rerenderList();
    });
  });

  rerenderList();
});