import React, { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp,getFirestore} from 'firebase/firestore'
import EditTask from './EditTask'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Tasks = () => {

  const [tasks, setTasks] = useState([]);

  const [createTask, setCreateTask] = useState("")

  const [checked, setChecked] = useState([]);

  const database = getFirestore();
  const collectionRef = collection(database, 'tasks')

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Query the collection

  
  useEffect(() => {
    const getTasks = async () => {
      // const q = query(collectionRef, orderBy('task', 'asc'))
      const q = query(collectionRef, orderBy('timestamp'))
      await getDocs(q).then((tasks) => {
        let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setTasks(tasksData)
        setChecked(tasksData)
      }).catch((err) => {
        console.log(err);
      })
    }
    getTasks()
  }, [])


  //Add Task Handler
  const submitTask = async (e) => {
    e.preventDefault();
    console.log('SUBMITTING')
    handleClose()
    try {
      await addDoc(collectionRef, {
        task: createTask,
        isChecked: false,
        timestamp: serverTimestamp()
      })
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }


  //Delete Handler
  const deleteTask = async (id) => {
    try {
      window.confirm("Are you sure you want to delete this task?")
      const documentRef = doc(database, "tasks", id);
      await deleteDoc(documentRef)
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  //Checkbox Handler
  const checkHandler = async (event, task) => {

    setChecked(state => {
      const indexToUpdate = state.findIndex(checkBox => checkBox.id.toString() === event.target.name);
      let newState = state.slice()
      newState.splice(indexToUpdate, 1, {
        ...state[indexToUpdate],
        isChecked: !state[indexToUpdate].isChecked,

      })
      setTasks(newState)
      return newState
    });


    // Persisting the checked value
    try {
      const docRef = doc(database, "tasks", event.target.name);
      await runTransaction(database, async (transaction) => {
        const taskDoc = await transaction.get(docRef);
        if (!taskDoc.exists()) {
          throw "Document does not exist!";
        }
        const newValue = !taskDoc.data().isChecked;
        transaction.update(docRef, { isChecked: newValue });
      });
      console.log("Transaction successfully committed!");
    } catch (error) {
      console.log("Transaction failed: ", error);
    }

  };



  console.log("tasks", tasks)
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-white">
              <div className="card-body">
                <button
                  type="button"
                  className="btn btn-info" onClick={handleShow}>Add Task
                  
                </button>

                {tasks.map(({ task, isChecked, id, timestamp }) =>
                  <div className="todo-list" key={id}>
                    <div className="todo-item">
                      <hr />
                      <span className={`${isChecked === true ? 'done' : ''}`}>
                        <div className="checker" >
                          <span className="" >
                            <input
                              type="checkbox"
                              defaultChecked={isChecked}
                              onChange={(event) => checkHandler(event, task)}
                              name={id}
                            />
                          </span>
                        </div>
                        &nbsp;{task}<br />
                        <i>{new Date(timestamp.seconds * 1000).toLocaleString()}</i>
                      </span>
                      <span className=" float-end mx-3"><EditTask task={task} id={id} /></span>
                      <button
                        type="button"
                        className="btn btn-danger float-end"
                        onClick={() => deleteTask(id)}
                      >Delete</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a Task"
                  onChange={(e) => setCreateTask(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                
              </div>
          </Modal.Body>
        <Modal.Footer>
         <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>

        <button className="btn btn-primary" onClick={submitTask}>Create Task</button>
        </Modal.Footer>
      </Modal>
      {/* <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-white">
              <div className="card-body">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#addModal"
                  type="button"
                  className="btn btn-info">Add Task
                </button>

                {tasks.map(({ task, isChecked, id, timestamp }) =>
                  <div className="todo-list" key={id}>
                    <div className="todo-item">
                      <hr />
                      <span className={`${isChecked === true ? 'done' : ''}`}>
                        <div className="checker" >
                          <span className="" >
                            <input
                              type="checkbox"
                              defaultChecked={isChecked}
                              onChange={(event) => checkHandler(event, task)}
                              name={id}
                            />
                          </span>
                        </div>
                        &nbsp;{task}<br />
                        <i>{new Date(timestamp.seconds * 1000).toLocaleString()}</i>
                      </span>
                      <span className=" float-end mx-3"><EditTask task={task} id={id} /></span>
                      <button
                        type="button"
                        className="btn btn-danger float-end"
                        onClick={() => deleteTask(id)}
                      >Delete</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <form className="d-flex" onSubmit={submitTask}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">Add Task</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">


                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a Task"
                  onChange={(e) => setCreateTask(e.target.value)}
                />

              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                <button className="btn btn-primary">Create Task</button>
              </div>
            </div>
          </form>
        </div>
      </div> */}
    </>
  )
}

export default Tasks