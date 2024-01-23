import React, { useState, useEffect } from 'react';
import { getUser, resetUserSession } from '../service/AuthService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css'; // Import the CSS file

const todoUrl = process.env.REACT_APP_TODO_LIST;

const TodoList = () => {
  const user = getUser();
  const username = user !== 'undefined' && user ? user.username : '';
  const name = user !== 'undefined' && user ? user.name : '';
  const navigate = useNavigate();

  const logoutHandler = () => {
    resetUserSession();
    navigate('/');
  }

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null); // Track which todo is being edited
  const [editedText, setEditedText] = useState(''); // Track edited text
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTodos();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const tabletWidthThreshold = 768; // Adjust this value as needed
      setIsMobile(window.innerWidth < tabletWidthThreshold);
    };

    // Attach event listener for window resize
    window.addEventListener('resize', handleResize);

    // Call handleResize on component mount to check initial width
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${todoUrl}/todo-prod/todos`, {
        params: {
          username: username, // Pass the username as a parameter
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  if (isMobile) {
    return (
      <div>
        <p>Please turn on desktop mode</p>
      </div>
    );
  }

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        await axios.post(`${todoUrl}/todo-prod/todo`, { title: newTodo, completed: false, username: username });
        setNewTodo('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${todoUrl}/todo-prod/todo`, { data: { id } });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`${todoUrl}/todo-prod/todo`, { id, updateKey: 'completed', updateValue: !completed });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditedText(text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedText('');
  };

  const saveEditing = async (id, text) => {
    try {
      await axios.patch(`${todoUrl}/todo-prod/todo`, { id, updateKey: 'title', updateValue: text });
      setEditingId(null);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="container">
      <p className='heading'> Welcome {name} <br />
        <input type='button' value="Logout" onClick={logoutHandler} className='logoutButton' /> </p>
      <h2 className="heading">Todo List</h2>
      <div className="inputSection">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addTodo();
            }
          }}
          className="inputTodo"
        />
        <button onClick={addTodo} className="addButton">
          Add Todo
        </button>
      </div>
      <ul className="todoList">
        {todos.map((todo) => (
          <li key={todo.id} className="todoItem">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
              className="checkbox"
            />
            {editingId === todo.id && !todo.completed ? (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  // onBlur={cancelEditing}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      saveEditing(todo.id, editedText);
                    }
                  }}
                  className="editInput"
                />
                <button onClick={() => saveEditing(todo.id, editedText)} className="saveButton">
                  ✔
                </button>
                <button onClick={cancelEditing} className="cancelButton">
                  ✖
                </button>
              </div>
            ) : (
              <span
                onClick={() => !todo.completed && startEditing(todo.id, todo.title)}
                className={todo.completed ? 'completed editable' : 'editable'}
              >
                {todo.title}
              </span>
            )}
            <button onClick={() => deleteTodo(todo.id)} className="deleteButton">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
