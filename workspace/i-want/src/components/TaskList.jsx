import React, { useState, useEffect } from 'react';
import { initDB, addTaskToDB, getTasksFromDB, updateTaskInDB, deleteTaskFromDB } from '../utils/database';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
        const savedTasks = await getTasksFromDB();
        setTasks(savedTasks);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDB();
  }, []);

  const addTask = async () => {
    if (newTask.trim() !== '') {
      const task = { id: Date.now(), text: newTask, completed: false };
      try {
        await addTaskToDB(task);
        setTasks([...tasks, task]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleTask = async (id) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      await updateTaskInDB(updatedTasks.find(task => task.id === id));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskFromDB(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-list">
      <h2>Task List</h2>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleTask(task.id)}>{task.text}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;