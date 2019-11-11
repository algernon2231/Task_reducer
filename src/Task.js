import React, {useState, useEffect, useReducer } from 'react'
import uuid from 'uuid/v4'

const initialTasksState = {
  tasks :[],
  completedTasks : []
}
const TYPES = {
  ADD_TASK: 'ADD_TASK',
  COMPLETE_TASK : 'COMPLETE_TASK',
  DELETE_TASK : 'DELETE_TASK'
}
const tasksReducer = (state , action ) => {
  console.log('state: ', state, 'action: ', action);
  switch(action.type){
    case TYPES.ADD_TASK:
        return {
          ...state,
          tasks: [...state.tasks,action.task]
        }
    case TYPES.COMPLETE_TASK:
       const { completedTask} = action 
        return {
          ...state,
          completedTasks: [...state.completedTasks, completedTask ],
          tasks: state.tasks.filter( t => t.id !== completedTask.id)
        } 
    case TYPES.DELETE_TASK: 
      return {
        ...state,
        completedTasks : state.completedTasks.filter( t => t.id !== action.task.id)
      }       
    default :
        return state
  }
}

const TASKS_STORAGE_KEY = 'TASKS_STORAGE_KEY';
const storeTasks = (taskMap) =>{
  localStorage.setItem( 
    TASKS_STORAGE_KEY,
    JSON.stringify(taskMap)
  )
}
 const readStoredTasks = () => {
    const taskMap = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) ;
    return taskMap ? taskMap :  initialTasksState
 }
const Task = () => {

  
  const  storedTasks = readStoredTasks();
  const [taskText, setTaskText] = useState('')
  // const [tasks,setTasks] = useState (storedTasks.tasks)
  // const [completedTasks, setCompletedTasks] = useState(storedTasks.completedTasks)
  
  const [state, dispatch] = useReducer(tasksReducer, storedTasks);

  const {tasks, completedTasks} = state;

 console.log('state', state)

  useEffect(() =>{
    storeTasks({tasks, completedTasks})
  })
  
  const updateTaskText = (e) => {
    setTaskText(e.target.value);

  }
  const addTask = () => {
    dispatch({type:TYPES.ADD_TASK ,task: {id : uuid(), taskText}})
    // setTasks([...tasks, {id: uuid(),taskText}])
    setTaskText('')
  }

  const completeTask = completedTask => () => {
    dispatch({type: TYPES.COMPLETE_TASK,completedTask})
    // setCompletedTasks([...completedTasks,completedTask])
    // setTasks(tasks.filter(task => task.id !== completedTask.id))
  }
  const deleteTask = task => () => {
   // const cf = window.confirm("Ban thuc su muon xoa");
    //if ( cf === true){
    //  dispatch({TYPE: TYPES.DELETE_TASK, task})
     // setCompletedTasks(completedTasks.filter(t =>  t.id !== task.id ));
     dispatch({type: TYPES.DELETE_TASK, task})
  //  }
  }
  // console.log('tasks',tasks)
  console.log('completedTasks',completedTasks)
  return (
    <div>
      <h3>Tasks</h3>
      <div className='form'>
        <input value = {taskText} onChange = {updateTaskText} />
        <button onClick = {addTask}>Add Task</button>
      </div>
      <div className = "task-list">
      { tasks.map(task => {
          const {id, taskText}  = task
          return <div key = {id} onClick = {completeTask(task)}>{taskText}</div>
        })} 
      </div>
      <hr/> 
      { typeof(completedTasks) !== 'undefined' &&  completedTasks.length > 0 &&  <h3>Completed Task</h3> }
      <div className ="completed-list">
        {
          completedTasks.map(task => {
            const { id, taskText} = task;
            return (
              
              <div key = {id}>{taskText} &nbsp;<span onClick = {deleteTask(task)} className="delete-task">X</span></div>
            )
          })
        } 
      </div>
    </div>
  )
}

export default Task