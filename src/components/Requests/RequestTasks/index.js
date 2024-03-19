
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import Card from 'react-bootstrap/Card';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ListGroup } from 'react-bootstrap';
import { createRFI } from '../../../redux/requests/createRFI';

import '../RequestTasks/index.css'

import Spinner from 'react-bootstrap/Spinner';
import '../../../App.css'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";

const RequestTasks = () => {
    const dispatch = useDispatch();

    const storage = getStorage();
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [request, setRequest] = useState()
    const [employee, setEmployee] = useState()
    const database = getFirestore()
    const [employees, setEmployees] = useState([])
    const [response, setResponse] = useState('')
    const [disapproveResponse, setDisapproveResponse] = useState('')

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const handleClose = () => setShow(false);
    const handleClose2 = () => setShow2(false);
    const handleClose3 = () => setShow3(false);
    const [isChecked, setIsChecked] = useState(false);
    const [imageButton, setImageButton] = useState([]);
    const [imageInputs, setImageInputs] = useState([]);

    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );

    const handleSubmit = (req) => {

        setRequest(req)
        setShow(true)
    }

    const handleApprove = (req) => {

        setRequest(req)
        setShow2(true)
    }

    useEffect(async () => {
        const q = query(collection(database, "requests"));

        await getDocs(q).then((request) => {
            let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRequests(requestsData)
            setLoading(false)
            console.log(user.data.uid)
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
    const addImageInput = () => {
        setImageButton([...imageButton, { id: imageButton.length }]);
    };

    const handleImageUpload = (index, event) => {
        // Handle image upload logic here, e.g., save the image to state or perform other actions
        const newItems = [...imageInputs, event.target.files[0]]

        setImageInputs(newItems)

    };


    const submitRFI = (e) => {
        e.preventDefault();
        console.log('Submitting')
        let newArray = []
        var bar = new Promise((resolve, reject) => {
            imageInputs.forEach((image, index, array) => {

                const storageRef = ref(storage, 'rfiImages/' + image.name);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed',
                    (snapshot) => {

                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                    },
                    () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            console.log('File available at', downloadURL)

                            newArray.push(downloadURL)
                            if (index === array.length - 1) resolve();
                        });
                    }
                );
            })
        })
        bar.then(() => {
            dispatch(
                createRFI({
                    name: request.name,
                    deadline: request.deadline,
                    project: request.project,
                    desc: request.desc,
                    images: newArray,
                    submitter: request.submitter,
                    date: request.date,
                    response: response,
                    id: request.identifier,
                    step: 2,
                    origId: request.id
                })
            );
        });

    }

    const approveRFI = async () => {
        if (request.assignTo == 'manager@gmail.com') {
            const requestDocRef = doc(database, "requests", request.id)
            await updateDoc(requestDocRef, {
                assignTo: 'ceo@gmail.com'
            })
        } else {
            const requestDocRef = doc(database, "requests", request.id)
            await updateDoc(requestDocRef, {
                status: 'done',
                url: request.submittedUrl
            })
        }
    }

    const disapproveRFI = async () => {
        const requestDocRef = doc(database, "requests", request.id)
        await updateDoc(requestDocRef, {
            status: 'for submission',
            assignTo: request.submitterEMail,
            disapproveReason: disapproveResponse
        })
    }
    if (loading) {
        return (
            <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
            </div>
        );
    } else {
        return (
            <>
                <div className='cards-container'>
                    {requests.map((request, index) => {
                        if (user.data.uid === request.submitterEmail) {
                            return (
                                <>
                                    <Card className='card' border="secondary" style={{ width: '18rem' }} key={index}>
                                        <Card.Header>Type</Card.Header>
                                        <Card.Body>
                                            <Card.Title>{request.project}</Card.Title>
                                            <Card.Text>
                                                {request.desc}
                                            </Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>Sumbitted by : {request.name}</ListGroup.Item>
                                            <ListGroup.Item>Deadline : {request.deadline}</ListGroup.Item>
                                            <ListGroup.Item>Date : {new Date(request.date.seconds * 1000).toLocaleString()}</ListGroup.Item>
                                            <ListGroup.Item>Assigned To : {request.submitter}</ListGroup.Item>
                                            <ListGroup.Item>Status: {request.status}</ListGroup.Item>
                                        </ListGroup>
                                        <Card.Body>
                                            <Card.Link href={request.url}>View Request</Card.Link> &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                                            {request.status == 'for submission' && (
                                                <Button onClick={() => handleSubmit(request)} variant="primary">Submit</Button>
                                            )}
                                            {request.status == 'for approval' && (
                                                <Button onClick={() => handleApprove(request)} variant="primary">View</Button>
                                            )}

                                        </Card.Body>
                                    </Card>

                                </>
                            )




                        }
                    })
                    }
                </div>

                {/* Submit Request */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Complete Request</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={submitRFI}>
                        <Modal.Body>


                            <Form.Label>Response to Query</Form.Label>

                            <Form.Control onChange={(e) => setResponse(e.target.value)} as="textarea" rows={3} />
                            <Form.Label>Images</Form.Label>
                            {imageButton.map((input, index) => (

                                <Form.Control key={input.id}
                                    accept="image/*"
                                    type="file"
                                    onChange={(event) => handleImageUpload(index, event)}
                                />
                            ))}

                            <Button onClick={addImageInput}>Add Image</Button>

                        </Modal.Body>
                        {request && request.disapproveReason && (
                            <Modal.Body>
                                <p>Reason for Disapproval : {request.disapproveReason}</p>
                            </Modal.Body>
                        )}
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* Approve Request */}
                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Approve Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={() => approveRFI()}>

                            <Form.Label>Response to RFI</Form.Label>
                            {request && (
                                <Button href={request.submittedUrl}>View</Button>
                            )}



                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose2}>Close</Button>
                                <Button variant="primary" type="submit">Approve</Button>
                                <Button variant="primary" onClick={() => setShow3(true)} type="submit">Disapprove</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/*Reason for Disapproval*/}
                <Modal show={show3} onHide={handleClose3}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reason for Disapproval</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={() => disapproveRFI()}>

                            <Form.Label>Response to RFI</Form.Label>
                            <Form.Control onChange={(e) => setDisapproveResponse(e.target.value)} as="textarea" rows={3} />


                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose3}>Close</Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>


        )
    }
}

export default RequestTasks

