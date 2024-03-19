

import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";





const Home = () => {
    const database = getFirestore()
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const { path } = useRouteMatch();
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);

    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);

    const [preset, setPreset] = useState([]);
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [workflowTask, setWorkflowTask] = useState({})
    const [init, setInit] = useState('')
    const history = useHistory();
    const [approvalTo, setApprovalTo] = useState('')
    const [assignTo, setAssignTo] = useState('')

    const [createTask, setCreateTask] = useState("")

    const [users, setUsers] = useState([]);
    const [divs, setDivs] = useState([]);

    const usersRef = collection(database, "users");


    const presetRef = collection(database, "presets");

    const [presetDocRef, setPresetDocRef] = useState()
    const tasksRef = collection(database, 'tasks')

    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    const [startId, setStartId] = useState()
    const [startStarted, setStartStarted] = useState()
    const [startTasks, setStartTasks] = useState()
    const [project, setProject] = useState('')
    const createWorkflowPreset = async (e) => {
        e.preventDefault();
        console.log(name, desc);


        await addDoc(presetRef, {
            name: name,
            description: desc,
            tasks: [],
            init: init,
        }).catch(err => {
            console.error();
        })
        window.location.reload()
    }


    const addWorkflowtToTask = (e) => {
        console.log('E  ' + e)
        setShow2(true)
        setPresetDocRef(doc(database, "presets", e))

    }


    const [textBoxes, setTextBoxes] = useState([{ id: Math.random().toString(36).slice(2, 7), value: '' }]); // Initial state with one textbox

    // Function to add a new textbox
    const addTextBox = () => {
        const newId = Math.random().toString(36).slice(2, 7); // Generate unique ID
        setTextBoxes(prevTextBoxes => [...prevTextBoxes, { id: newId, value: '' }]);
    };

    // Function to remove a textbox by ID
    const removeTextBox = (id) => {
        setTextBoxes(prevTextBoxes => prevTextBoxes.filter(textBox => textBox.id !== id));
    };

    // Function to handle changes in textbox values
    const handleTextBoxChange = (id, value) => {
        setTextBoxes(prevTextBoxes =>
            prevTextBoxes.map(textBox =>
                textBox.id === id ? { ...textBox, value: value } : textBox
            )
        );
    };

    // Function to get the values of all textboxes
    const getValues = () => {
        console.log(textBoxes);
        console.log(assignTo)
    };
    const submitTask = async (e) => {
        const gotDoc = await getDoc(presetDocRef)

        let updatedObject
        if (!checked3) {
            updatedObject = {
                ...workflowTask,
                name: name,
                active: false,
                parentId: Math.random().toString(36).slice(2, 7),
                workflow: gotDoc.id,
                workflowname: gotDoc.data().name,
                manualTasks: checked3
            };
        } else {
            updatedObject = {
                ...workflowTask,
                name: name,
                requirements: textBoxes,
                approval: checked,
                recurring: checked2,
                approvalTo: approvalTo,
                assignTo: assignTo,
                employeeManual: checked3,
                active: false,
                parentId: Math.random().toString(36).slice(2, 7),
                workflow: gotDoc.id,
                workflowname: gotDoc.data().name,
                manualTasks: checked3

            };
        }


        e.preventDefault();

        setWorkflowTask(updatedObject)

        console.log('taksname ' + JSON.stringify(updatedObject))
        console.log('workflowTask ' + JSON.stringify(workflowTask))

        try {
            await updateDoc(presetDocRef, {
                tasks: arrayUnion(updatedObject)
            })

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const changeStatus = async (id, started, tasks) => {


        try {
            await updateDoc(doc(database, "workflows", id), {
                started: started
            })

            if (started) {

                const workflowRef = doc(database, "workflows", id)
                const workflow = await getDoc(workflowRef)

                console.log(workflow.data().tasks)
                const statusTask = workflow.data().tasks
                statusTask[0].active = true


                const q = query(collection(database, "users"), where('role', '==', statusTask[0].assignTo))

                const querySnapshot = await getDocs(q);


                querySnapshot.forEach(async (user) => {
                    console.log(user.id)
                    const setTasksRef = doc(database, 'tasks', statusTask[0].parentId)
                    await setDoc(setTasksRef, {
                        task: statusTask[0].name,
                        isChecked: false,
                        timestamp: serverTimestamp(),
                        deadline: 'None',
                        employee: user.data().name,
                        employeeId: user.data().email,
                        requirements: statusTask[0].requirements,
                        status: 'submission',
                        approval: statusTask[0].approval,
                        workflow: statusTask[0].workflow,
                        workflowname: workflow.data().name,
                        approvalTo: statusTask[0].approvalTo,
                        project: project
                    })




                    // doc.data() is never undefined for query doc snapshots
                });

                await updateDoc((workflowRef), {
                    tasks: statusTask
                })
            }
            if (!started) {

                const newArray = []
                const workflowRef = doc(database, "workflows", id)

                var bar = new Promise((resolve, reject) => {
                    tasks.forEach(async (tasks, index, array) => {
                        console.log('ID' + tasks.id)

                        if (tasks.active == true) {
                            await deleteDoc(doc(database, "tasks", tasks.parentId))
                            tasks.active = false
                        }

                        console.log(tasks.active)
                        newArray.push(tasks)

                        console.log('Array' + newArray)
                        if (index === array.length - 1) resolve();
                    });
                });

                bar.then(async () => {
                    await updateDoc((workflowRef), {
                        tasks: newArray
                    })
                    console.log('Array HERE: ' + JSON.stringify(newArray))

                });



            }
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
    };


    const submitProject = () => {

        console.log(project)


        changeStatus(startId, startStarted, startTasks, project)
    };


    useEffect(() => {

        const getWorkflows = async () => {
            const q = query(presetRef)
            await getDocs(q).then((workflow) => {
                let workflowData = workflow.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setPreset(workflowData)
            }).catch((err) => {
                console.log(err);
            })
        }
        getWorkflows()



    }, [])



    return (
        <>
            <Button onClick={() => setShow(true)} variant="primary">Create a preset</Button>

            <Accordion>
                {preset.map(({ name, description, id, tasks, started }) =>

                    <Accordion.Item eventKey={id} >
                        <Accordion.Header>{name}</Accordion.Header>

                        <Accordion.Body>
                            {description}

                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Task Name</th>
                                        <th>Requirements</th>
                                        <th>Request Approval</th>
                                        <th>Recurring</th>
                                        <th>Approval To:</th>
                                        <th>Assign To:</th>
                                        <th>Manually Assign Employee?</th>

                                    </tr>
                                </thead>
                                {tasks && (
                                    <>
                                        {tasks.map((task, id) =>
                                            <tbody>
                                                <tr key={id}>
                                                    <td>{id}</td>
                                                    <td>{task.name}</td>
                                                    <td>
                                                        {task.requirements && (
                                                            <>
                                                                {task.requirements.map((item, index) => (
                                                                    <span key={index}>
                                                                        {item.value}
                                                                        {index !== item.length - 1 && ', '}
                                                                    </span>
                                                                ))}
                                                            </>
                                                        )}

                                                    </td>

                                                    {task.approval ? (<td>Yes</td>) : (<td>No</td>)}
                                                    {task.recurring ? (<td>Yes</td>) : (<td>No</td>)}
                                                    <td>{task.approvalTo}</td>
                                                    <td>{task.assignTo}</td>
                                                    {task.employeeManual ? (<td>Yes</td>) : (<td>No</td>)}

                                                </tr>
                                            </tbody>
                                        )}
                                    </>
                                )}

                            </Table>

                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={() => addWorkflowtToTask(id)}>Add Stage</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
            <Modal show={show} onHide={() => handleClose} >

                <Modal.Header closeButton> Create a workflow</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={createWorkflowPreset}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Workflow preset Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Schematics Process"
                                autoFocus
                                name='name'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder='Initial stage of designing a project'
                                rows={2}
                                name='description'
                                onChange={(e) => setDesc(e.target.value)}
                            />
                            <Form.Select onChange={(e) => setInit(e.target.value)} aria-label="Default select example">
                                <option hidden value>Started by: </option>
                                <option value="CEO">CEO</option>
                                <option value="Manager">Manager</option>
                            </Form.Select>

                        </Form.Group>

                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>



            </Modal>

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Stage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name the stage"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br></br>

                    <label>
                        <input
                            type="checkbox"
                            checked={checked3}
                            onChange={() => setChecked3(!checked3)}
                        />
                        Manually Set Requirements
                    </label>
                    {checked3 && (
                        <>
                            <br></br>

                            <Button variant='secondary' onClick={addTextBox}>Add Requirement</Button>
                            <br></br>
                            {textBoxes.map(({ id, value }) => (
                                <div key={id}>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleTextBoxChange(id, e.target.value)}
                                    />
                                    <button onClick={() => removeTextBox(id)}>Remove</button>
                                </div>
                            ))}
                            <br></br>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => setChecked(!checked)}
                                />
                                Approval
                            </label>



                            {checked && (
                                <>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={checked2}
                                            onChange={() => setChecked2(!checked2)}
                                        />
                                        Recurring
                                    </label>
                                    <Form.Select onChange={(e) => setApprovalTo(e.target.value)} aria-label="Default select example">
                                        <option hidden value>Request Approval to </option>
                                        <option value="CEO">CEO</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Manager and CEO">Manager and CEO</option>
                                    </Form.Select>
                                </>
                            )}
                            <Form.Select onChange={(e) => setAssignTo(e.target.value)} aria-label="Default select example">
                                <option hidden value>Assign To: </option>
                                <option value="CEO">CEO</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                            </Form.Select>
                        </>

                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose2}>Close</button>
                    <button className="btn btn-primary" onClick={submitTask}>Create Stage</button>
                </Modal.Footer>
            </Modal>

            <Modal show={show3} onHide={() => handleClose3} >

                <Modal.Header closeButton> Assign Project for Stage</Modal.Header>
                <Modal.Body>
                    <Form.Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Project"
                        onChange={(e) => setProject(e.target.value)}
                    >
                        <option hidden value>Select Project...</option>
                        <option value='Miramonti'>Miramonti</option>
                        <option value='Monumento'>Monumento</option>
                        <option value='Montecristo'>Montecristo</option>
                        <option value='Muramana'>Muramana</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose3}>Close</button>
                    <button className="btn btn-primary" onClick={submitProject}>Submit</button>
                </Modal.Footer>



            </Modal>
        </>

    )
}

export default Home

{/* {workflows.tasks.map(({ name, description,id}) =>
            <Accordion.Item key ={id}>
                <Accordion.Header> Workflow Name</Accordion.Header>
                <Accordion.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        )} */}