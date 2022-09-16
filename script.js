
/*  Sellectors  */

const body = document.body;
const formT = document.querySelector(`[new-todo-form]`)
const inputT = document.querySelector(`[new-todo-input]`)
const todoList = document.getElementById('todo-list');
const filterList = document.querySelector('.controls-list')
const allTasks = document.querySelector('.All')
const activeTasks = document.querySelector('.Active')
const completedTasks = document.querySelector('.Completed')

/* arry that holds tasks */
let tasks = [];


/*  EVENT LISITNERS */



formT.addEventListener('submit', e => {
    e.preventDefault()
    
    let text = inputT.value.trim();
    if(text !== '') {
       addTask(text);
       inputT.value = '';
       inputT.focus();

    } 
 
})


todoList.addEventListener('click', e => {
    if (e.target.classList.contains('js-tick')) {
        const itemKey = e.target.parentElement.dataset.key;
        toggleDone(itemKey);
        
    }

    if (e.target.classList.contains('delete')) {
        const itemKey = e.target.parentElement.dataset.key;
        deleteTodo(itemKey);
        counter();
      }

      
    
});

allTasks.addEventListener('click',  (e) => {
    todoList.innerHTML = ''
    const ref = localStorage.getItem('tasksRef');
    if (ref) {
      tasks = JSON.parse(ref);
      tasks.forEach(task => {
        renderTodo(task, true);
        counter();
      });
    }
})

completedTasks.addEventListener('click',  (e) => {
    todoList.innerHTML = ''
    const ref = localStorage.getItem('tasksRef');
    if (ref) {
      tasks = JSON.parse(ref);
      tasks.filter(item=>item.checked).forEach(task => {
        renderTodo(task, true);
        counter();
      });
    }
})

activeTasks.addEventListener('click',  (e) => {
    todoList.innerHTML = ''
    const ref = localStorage.getItem('tasksRef');
    if (ref) {
      tasks = JSON.parse(ref);
      tasks.filter(item => !item.checked).forEach(task => {
        renderTodo(task, true);
        counter();
      });
    }
})


document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('tasksRef');
    if (ref) {
      tasks = JSON.parse(ref);
      tasks.forEach(task => {
        renderTodo(task);
        counter();
      });
    }
  });



  /* FUNCITONS */

/* create a todo object */
const addTask = (text) => {
    const todoTask = {
        text,
        checked: false,
        id: Date.now(),
    }
    tasks.push(todoTask);
    renderTodo(todoTask);

};


const renderTodo = (todoTask, preventMutableStorage)=> {

    if (!preventMutableStorage) {
        localStorage.setItem('tasksRef', JSON.stringify(tasks));
    }
    
    const item = document.querySelector(`[data-key='${todoTask.id}']`);

    if (todoTask.deleted) {
        // remove the item from the DOM
        item.remove();
        return
      }
      

    const isChecked = todoTask.checked ? 'done': '';

    const node = document.createElement('li')
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todoTask.id);
    node.innerHTML = `
    
    <input class="js-tick" id="${todoTask.id}" type="checkbox" ${isChecked ? "checked" :""}/>
    
    <span>${todoTask.text}</span>
    <img class="delete" width="3%px"  src="photo/icon-cross.svg" alt="cross">`
    ;
    todoList.append(node);

    if (item) {
        node.replaceWith(item)
    } else {
        todoList.append(node)
    }
    counter();

}



const toggleDone = (key) => {
    
    const index = tasks.findIndex(task=> task.id === Number(key));

    tasks[index].checked = !tasks[index].checked;
    renderTodo(tasks[index]);
    renderCompletedTodos()
}

const deleteTodo = (key) => {
    const index = tasks.findIndex(item => item.id === Number(key));


    const todoTask = {
        ...tasks[index],
        deleted: true
        
      };
      tasks = tasks.filter(item => item.id !== Number(key));
  renderTodo(todoTask);

}

const renderCompletedTodos = () => {
    const ref = localStorage.getItem('tasksRef');
    if (ref) {
      tasks = JSON.parse(ref);
      tasks.filter(item => item.check).forEach(task => {
        renderTodo(task, true);
        counter();
      });
    }
}

completedTasks.addEventListener('click', renderCompletedTodos)
/* const renderActiveTodos = () => {
    
}
 */

const counter = () => {
    const itemsCounter =  tasks.filter(task=> !task.checked)
    const count = document.getElementById('todosLeft');

    const counterString = itemsCounter.length === 1 ? 'item' : 'items'

 count.innerText = `${itemsCounter.length} ${counterString} left`

}



