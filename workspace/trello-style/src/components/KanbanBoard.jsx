import { useState } from 'react';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    { id: 1, title: 'To Do', tasks: [] },
    { id: 2, title: 'In Progress', tasks: [] },
    { id: 3, title: 'Done', tasks: [] }
  ]);

  const [newTask, setNewTask] = useState('');

  const addTask = (columnId) => {
    if (newTask.trim() === '') return;

    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, { id: Date.now(), text: newTask }]
        };
      }
      return column;
    }));

    setNewTask('');
  };

  const moveTask = (taskId, fromColumnId, toColumnId) => {
    const fromColumn = columns.find(column => column.id === fromColumnId);
    const toColumn = columns.find(column => column.id === toColumnId);
    const task = fromColumn.tasks.find(task => task.id === taskId);

    setColumns(columns.map(column => {
      if (column.id === fromColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        };
      }
      if (column.id === toColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, task]
        };
      }
      return column;
    }));
  };

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h1>Kanban Board</h1>
      </div>
      <div className="kanban-columns">
        {columns.map(column => (
          <div key={column.id} className="kanban-column">
            <h2>{column.title}</h2>
            <div className="task-list">
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  className="task"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, fromColumnId: column.id }))}
                >
                  {task.text}
                </div>
              ))}
              <div
                className="task-drop-zone"
                onDrop={(e) => {
                  e.preventDefault();
                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                  moveTask(data.taskId, data.fromColumnId, column.id);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                Drop here
              </div>
            </div>
            <div className="add-task">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
              />
              <button onClick={() => addTask(column.id)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;