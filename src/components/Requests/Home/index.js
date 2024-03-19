
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";



import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import RequestTasks from '../RequestTasks';
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';


const Home = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [request, setRequest] = useState()
    const [employee, setEmployee] = useState()
    const database = getFirestore()
    const [employees, setEmployees] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [isChecked, setIsChecked] = useState(false);

    const assignEmployee = (request) => {
        setRequest(request)
        setShow(true)
    }
    const assignEmployeeToTask = async (e) => {

        e.preventDefault();

        const requestRef = doc(database, "requests", request.id);
        const requestSnap = await getDoc(requestRef);



        if (!isChecked) {
            const q = query(collection(database, "users"), where("name", "==", employee));

            let employeeEmail
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                employeeEmail = doc.data().email
            });


            // Set the "capital" field of the city 'DC'
            await updateDoc(requestRef, {
                submitter: employee,
                submitterEmail: employeeEmail,
                status: 'for submission',
                assignTo:employeeEmail
            }); 
        } else {
            console.log('Checked')
            let employeeAuto
            let employeeAutoEmail
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
                employeeAutoEmail = user.data().email
            })
            const taskRef = doc(collection(database, "tasks"));
            await updateDoc(requestRef, {
                submitter: employeeAuto,
                submitterEmail: employeeAutoEmail,
                status: 'for submission'
            }); 
        }
        window.location.reload()
    }

    useEffect(async () => {
        const q = query(collection(database, "requests"));

        await getDocs(q).then((request) => {
            let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRequests(requestsData)
            setLoading(false)
        }).catch((err) => {
            console.log(err);
        })
        const getEmployees = async () => {
            const q = query(collection(database, "users"), where('role', '==', 'Employee'))
            await getDocs(q).then((user) => {
                let userData = user.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setEmployees(userData)
            }).catch((err) => {
                console.log(err);
            })

        }
        getEmployees()


    }, []);
    if (loading) {
        return (
            <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
            </div>

        );
    } else {
        return (
            <>
                <div className='head' style={{ padding: '20px' }}>
                    <h2 >Requests </h2>
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>
                        <RequestTasks></RequestTasks>
                        <p></p><p></p>
                        <h5>Requests Manager</h5>
                        <p></p>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Project</th>
                                    <th>Query</th>
                                    <th>Deadline</th>
                                    <th>Created in</th>
                                    <th>Assigned to </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td></td>
                                        <td>{request.project}</td>
                                        <td>{request.desc}</td>
                                        <td>{request.deadline}</td>
                                        <td>{new Date(request.date.seconds * 1000).toLocaleString()}</td>
                                        {request.submitter === '' ?
                                            <Button onClick={() => assignEmployee(request)}>Assign Employee</Button>
                                            :
                                            <td>{request.submitter}</td>
                                        }
                                        <td><a href={request.url} target="_blank">View</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>
                </div>


                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Assign Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={assignEmployeeToTask}>

                            <Form.Label>Assign to RFI *ID*</Form.Label>

                            <Form.Select disabled={isChecked} style={{ opacity: isChecked ? 0.5 : 1 }} onChange={(e) => setEmployee(e.target.value)} aria-label="Default select example">
                                <option value="" disabled selected>Select Employee</option>
                                {employees.map((user, index) => (
                                    <option key={index} value={user.name}>{user.name}</option>
                                ))}

                            </Form.Select>
                            <Form.Check
                                label='Automatically Assign Employee?'
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}

                            />


                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose}>Close</Button>
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

