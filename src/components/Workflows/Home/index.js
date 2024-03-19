
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
import { AccordionHeader } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import ListGroup from 'react-bootstrap/ListGroup';
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';

const Home = () => {
    const [firstRender2, setFirstRender2] = useState(true);
    const [loading, setLoading] = useState(true)
    const database = getFirestore()
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const { path } = useRouteMatch();
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);

    const [workflows, setWorkflows] = useState([]);
    const [presets, setPresets] = useState([]);
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [workflowTask, setWorkflowTask] = useState({})
    const [init, setInit] = useState('')

    const [approvalTo, setApprovalTo] = useState('')
    const [assignTo, setAssignTo] = useState('')

    const [createTask, setCreateTask] = useState("")
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [employee, setEmployee] = useState();

    const usersRef = collection(database, "users");


    const workflowRef = collection(database, "workflows");
    const presetRef = collection(database, "presets");

    const [workflowDocRef, setWorkflowDocRef] = useState()
    const tasksRef = collection(database, 'tasks')

    const [presetId, setPresetId] = useState()
    const [preset, setPreset] = useState()

    const [assignEmployeeTask, setAssignEmployeeTask] = useState()
    const [assignEmployeeWorkflowId, setAssignEmployeeWorkflowId] = useState()

    const [startId, setStartId] = useState()
    const [startStarted, setStartStarted] = useState()
    const [startTasks, setStartTasks] = useState()
    const [project, setProject] = useState('')
    const [isChecked, setIsChecked] = useState(false);


    const createWorkflow = async (e) => {
        e.preventDefault();


        console.log('preset = ' + presetId)


        const docRef = doc(database, "presets", presetId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

        setPreset(docSnap.data())






        await addDoc(workflowRef, {
            name: name,
            preset: docSnap.data().name,
            description: docSnap.data().description,
            tasks: docSnap.data().tasks,
            init: docSnap.data().init,
            project: project,
            started: false,
            outputs: []
        }).catch(err => {
            console.error();
        })

        const q = query(collection(database, "workflows"), where("name", "==", name));
        let workflowId
        let workflowName

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            workflowId = doc.id
            workflowName = doc.data().name
        });

        let arrayTasks = docSnap.data().tasks

        // Function to update a specific field in all objects
        function updateFieldInAllObjects(array, fieldToUpdate, newValue) {
            array.forEach(obj => {
                obj[fieldToUpdate] = newValue; // Update the specified field in each object
            });
        }

        // Update the age of all objects to 40
        updateFieldInAllObjects(arrayTasks, 'workflow', workflowId);
        updateFieldInAllObjects(arrayTasks, 'workflowname', workflowName);

        const updateWorkflowRef = doc(database, "workflows", workflowId);


        await updateDoc(updateWorkflowRef, {
            tasks: arrayTasks
        });




        window.location.reload()
    }


    const assignEmployee = (workflowId, task) => {

        setAssignEmployeeWorkflowId(workflowId)
        setAssignEmployeeTask(task)
        setShow2(true)
    }

    const assignEmployeeToTask = async (e) => {

        e.preventDefault();
        const docRef = doc(database, "workflows", assignEmployeeWorkflowId);
        const docSnap = await getDoc(docRef);
        let something = docSnap.data().tasks
        const workflowRef = doc(database, "workflows", assignEmployeeWorkflowId);

        console.log('cECKED ' + isChecked)
        if (!isChecked) {
            docSnap.data().tasks.map(async (task, index) => {
                if (task.name === assignEmployeeTask.name) {
                    something[index].assignTo = employee
                    console.log('index ' + index)
                }

            });

            await updateDoc(workflowRef, {
                tasks: something
            });

        } else {
            console.log('Checked')
            let employeeAuto
            let q

            //WORKLOAD ALGORITHM
            for (let i = 0; i < 30; i++) {
                let r = query(collection(database, "users"), where('tasks', '==', i), where('role', '==', 'Employee'))
                const querySnapshots = await getDocs(r)
                if (!querySnapshots.empty) {
                    querySnapshots.forEach((user) => {
                        q = query(collection(database, "users"), where('name', '==', user.data().name))
                    })

                    break
                }
            }


            const employeeSnapshot = await getDocs(q);
            employeeSnapshot.forEach((user) => {
                employeeAuto = user.data().name
            })
            docSnap.data().tasks.map(async (task, index) => {
                if (task.name === assignEmployeeTask.name) {
                    something[index].assignTo = employeeAuto
                    console.log('index ' + index)
                }

            });
            await updateDoc(workflowRef, {
                tasks: something
            });

        }




        console.log('employee' + employee)
        console.log('task' + JSON.stringify(docSnap.data().tasks))

        window.location.reload()
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


    const changeStatus = async (id, started, tasks) => {


        try {
            await updateDoc(doc(database, "workflows", id), {
                started: !started
            })


            if (!started) {
                console.log('STARRT' + started)
                const workflowRef = doc(database, "workflows", id)
                const workflow = await getDoc(workflowRef)

                console.log(workflow.data().tasks)
                const statusTask = workflow.data().tasks
                statusTask[0].active = true

                let q

                if (statusTask[0].assignTo == 'CEO' || statusTask[0].assignTo == 'Manager') {
                    q = query(collection(database, "users"), where('role', '==', statusTask[0].assignTo))
                } else {
                    q = query(collection(database, "users"), where('name', '==', statusTask[0].assignTo))
                }


                const querySnapshot = await getDocs(q);


                querySnapshot.forEach(async (user) => {
                    const setTasksRef = doc(database, 'tasks', statusTask[0].parentId)
                    await setDoc(setTasksRef, {
                        task: statusTask[0].name,
                        isChecked: false,
                        timestamp: serverTimestamp(),
                        deadline: 'None',
                        employee: user.data().name,
                        employeeId: user.data().email,
                        requirements: statusTask[0].requirements,
                        status: 'for submission',
                        approval: statusTask[0].approval,
                        workflow: statusTask[0].workflow,
                        workflowname: workflow.data().name,
                        approvalTo: statusTask[0].approvalTo,
                        project: workflow.data().project
                    })

                    await addDoc(collection(database, "notifs"), {
                        title: `NEW TASK: ${statusTask[0].name} from ${workflow.data().name}`,
                        date: new Date(),
                        content: `Your task for ${workflow.data().name} has now begun. Please check it in the Task Manager`,
                        receiver: user.data().email

                    })




                    // doc.data() is never undefined for query doc snapshots
                });

                await updateDoc((workflowRef), {
                    tasks: statusTask
                })
            }
            if (started) {

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




    useEffect(() => {
        const getWorkflows = async () => {
            const q = query(workflowRef)
            await getDocs(q).then((workflow) => {
                let workflowData = workflow.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setWorkflows(workflowData)
                console.log('WORKFLOWS ' + JSON.stringify(workflowData))
            }).catch((err) => {
                console.log(err);
            })
        }
        getWorkflows()

        const getPresets = async () => {
            const q = query(presetRef)
            await getDocs(q).then((preset) => {
                let presetData = preset.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setPresets(presetData)

            }).catch((err) => {
                console.log(err);
            })
        }
        getPresets()

        const getEmployees = async () => {
            const q = query(collection(database, "users"), where('role', '==', 'Employee'))
            await getDocs(q).then((user) => {
                let userData = user.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setUsers(userData)
            }).catch((err) => {
                console.log(err);
            })

        }
        getEmployees()

    }, [])

    useEffect(async () => {
        if (firstRender2) {
            setFirstRender2(false);
            return;
        }
        setLoading(false)
    }, [workflows]);


if (loading){
    return (
        <div className='loadingcontain'>
            <Spinner className='loading' animation="border" variant="secondary" />
        </div>
    )
}else{
    return (
        <>
            <div className='head' style={{ padding: '20px' }}>
                <h2 >Workflows &nbsp;<Button onClick={() => setShow(true)} variant="primary"><FaPlus /></Button>   <Button onClick={() => history.push(`${path}/preset`)} variant="primary">Go to Presets</Button></h2>
                <hr></hr>
                <div className='content' style={{ padding: '5px' }}>
                    <Accordion >
                        {workflows.map(({ name, description, id, tasks, started, project, outputs }) =>
                            <Accordion.Item eventKey={id} >
                                <Accordion.Header > {name} &nbsp;&nbsp;&nbsp;{!started ? <Button onClick={() => changeStatus(id, started, tasks, project)}> Start </Button> : <Button onClick={() => changeStatus(id, started, tasks, project)}> Stop </Button>}
                                </Accordion.Header>


                                <Accordion.Body>
                                    {description}
                                    <hr></hr>
                                    Tasks:
                                    <p></p>

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


                                            </tr>
                                        </thead>
                                        {tasks && (
                                            <>
                                                {tasks.map((task, index) =>
                                                    <tbody>
                                                        <tr key={index}>
                                                            <td>{index}</td>
                                                            <td>{task.name}</td>
                                                            <td>
                                                                {task.requirements ? (
                                                                    <> {task.requirements.map((item, index) => (
                                                                        <span key={index}>
                                                                            {item.value}
                                                                            {index !== item.length - 1 && ', '}
                                                                        </span>
                                                                    ))
                                                                    }</>

                                                                ) : (
                                                                    <td>*Manual Stage*</td>
                                                                )}
                                                            </td>

                                                            {task.approval ? (<td>Yes</td>) : (<td>No</td>)}
                                                            {task.recurring ? (<td>Yes</td>) : (<td>No</td>)}
                                                            <td>{task.approvalTo}</td>

                                                            {task.assignTo === 'Employee' ?
                                                                <Button onClick={() => assignEmployee(id, task)}>Assign Employee</Button>
                                                                :
                                                                <td>{task.assignTo}</td>
                                                            }

                                                        </tr>
                                                    </tbody>
                                                )}
                                            </>
                                        )}

                                    </Table>

                                    {outputs && (
                                        <>

                                            <p>Outputs: </p>
                                            <ListGroup>
                                                {outputs.map((output, index) => (
                                                    <ListGroup.Item key={index}>{output.requirement} : <a href={output.url} target="_blank">View</a></ListGroup.Item>
                                                ))}
                                            </ListGroup>

                                        </>

                                    )}
                                </Accordion.Body>

                            </Accordion.Item>
                        )}
                    </Accordion>
                </div>

            </div>

            <Modal show={show} onHide={() => handleClose} >

                <Modal.Header closeButton> Create a Workflow</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={createWorkflow}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Workflow Preset</Form.Label>
                            <Form.Select onChange={(e) => setPresetId(e.target.value)} aria-label="Default select example">
                                <option value="" disabled selected>Select a preset...</option>
                                {presets.map((preset, index) => (
                                    <option key={index} value={preset.id}>{preset.name}</option>
                                ))}

                            </Form.Select>


                        </Form.Group>
                        {presetId && (
                            <>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Workflow Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder='<Project Name> Workflow'
                                        rows={2}
                                        name='description'
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <Form.Label>Project</Form.Label>
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
                                    <Form.Select onChange={(e) => setInit(e.target.value)} aria-label="Default select example">
                                        <option hidden value>Started by: </option>
                                        <option value="CEO">CEO</option>
                                        <option value="Manager">Manager</option>
                                    </Form.Select>
                                </Form.Group>

                            </>
                        )}

                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>



            </Modal>

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={assignEmployeeToTask}>
                        {assignEmployeeTask && (
                            <Form.Label>{assignEmployeeTask.name}</Form.Label>
                        )}

                        <Form.Select disabled={isChecked} style={{ opacity: isChecked ? 0.5 : 1 }} onChange={(e) => setEmployee(e.target.value)} aria-label="Default select example">
                            <option value="" disabled selected>Select Employee</option>
                            {users.map((user, index) => (
                                <option key={index} value={user.name}>{user.name}</option>
                            ))}

                        </Form.Select>
                        <Form.Check
                            label='Automatically Assign Employee?'
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}

                        />


                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose2}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

        </>

    )
}
   
}

export default Home
