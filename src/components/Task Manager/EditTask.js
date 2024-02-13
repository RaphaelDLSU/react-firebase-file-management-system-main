import React, { useState } from 'react'
import { doc, updateDoc,getFirestore } from 'firebase/firestore'

const EditTask = ({ task, id }) => {
  const database = getFirestore();
  const [tasks, setTasks] = useState([task])


  const updateTask = async (e) => {
    e.preventDefault()
    console.log(tasks)
    try {
      const taskDocument = doc(database, "tasks", id);
      await updateDoc(taskDocument, {
        task: tasks
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#id${id}`}      >
        Edit Task
      </button>

      <div
        className="modal fade"
        id={`id${id}`}
        tabIndex="-1"
        aria-labelledby="editLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editLabel">Update Task Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <form className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  defaultValue={tasks}
                  onChange={e => setTasks(e.target.value)}
                />
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={e => updateTask(e)}
              >Update Tasks</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditTask