

import React, { useEffect, useState } from 'react'
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, getBlob } from "firebase/storage";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Picker from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { addFileUser } from '../../../redux/actionCreators/filefoldersActionCreators';
import { toast } from 'react-toastify';
import TaskMonitoring from '../TaskMonitoring';
import { Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import '../../../App.css'

const Home = () => {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();
    const db = getFirestore()
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState();
    const [plan, setPlan] = useState();
    const [planCreate, setPlanCreate] = useState();
    const [hours, setHours] = useState();
    const [createTask, setCreateTask] = useState("")
    const [deadline, setDeadline] = useState("")
    const [checked, setChecked] = useState([]);
    const database = getFirestore()
    const collectionRef = collection(database, 'tasks')
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const handleClose = () => setShow(false);
    const handleClose2 = () => setShow2(false);
    const handleClose4 = () => setShow4(false);
    const handleShow = () => setShow(true);
    const handleShow4 = () => setShow4(true);
    const [auth, setAuth] = useState()
    const [users, setUsers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [stages, setStages] = useState([]);
    const [stage, setStage] = useState('');
    const [workflowOfStage, setworkflowOfStage] = useState('');
    const [workflowIdOfStage, setworkflowIdOfStage] = useState('');
    const usersRef = collection(database, "users");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const storage = getStorage();
    const [url, setUrl] = useState('')
    const [folderId, setFolderId] = useState('')
    const [folderId2, setFolderId2] = useState('')
    const [folderId2Name, setFolderId2Name] = useState('')
    const [reason, setReason] = useState('')
    const [approval, setApproval] = useState('')
    const [effectFile, setEffectFile] = useState('')
    const [firstRender, setFirstRender] = useState(true);
    const [firstRender3, setFirstRender3] = useState(true);
    const [firstRender2, setFirstRender2] = useState(true);
    const [reqArray, setReqArray] = useState([])
    const [doneChecker, setDoneChecker] = useState(false)
    const [project, setProject] = useState('')
    const [inputs, setInputs] = useState([]);
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );

    const [selectedOption, setSelectedOption] = useState(null);

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
        const getUsers = async () => {
            // const q = query(collectionRef, orderBy('task', 'asc'))
            const q = query(usersRef)
            await getDocs(q).then((users) => {
                let usersData = users.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setUsers(usersData)
            }).catch((err) => {
                console.log(err);
            })
        }
        getUsers()

        const getPlans = async () => {
            const q = query(collection(database, 'plans'))
            await getDocs(q).then((plan) => {
                let plansData = plan.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setPlans(plansData)
            }).catch((err) => {
                console.log(err);
            })
        }
        getPlans()

        const getStages = async () => {
            const q = query(collection(database, 'stages'))
            await getDocs(q).then((stages) => {
                let stagesData = stages.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setStages(stagesData)

            }).catch((err) => {
                console.log(err);
            })

        }
        getStages()
    }, [])

    //Add Task Handler
    const submitTask = async (e) => {

        e.preventDefault();
        console.log('WHAT THE FUCK LOL')


        console.log('INPUTS' + JSON.stringify(inputs))
        for (const input of inputs) {
            console.log(input.employee)
            const taskRef = collection(database, "tasks");

            const q = query(collection(database, "users"), where("email", "==", input.employee));

            console.log('there are inputs :)')
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (user) => {

                let approvalTemp = false
                let isApproval = ''
                if (approval == '') {
                    approvalTemp = 'Manager and CEO'
                    isApproval = true
                }
                await addDoc(taskRef, {
                    approval: isApproval,
                    approvalTo: approvalTemp,
                    employee: user.data().name,
                    employeeId: user.data().email,
                    project: project,
                    requirements: [{ value: input.requirement, id: Math.random().toString(36).slice(2, 7) }],
                    status: 'for submission',
                    task: plan,
                    timestamp: new Date(),
                    stage: stage,
                    hours: hours,
                    deadline: deadline,
                    workflowname: workflowOfStage,
                    workflow: workflowIdOfStage
                })
            });

        }
        console.log('finished')
    }
    //Delete Handler
    const deleteTask = async (id, employeeId) => {
        try {
            window.confirm("Are you sure you want to delete this task?")
            const documentRef = doc(database, "tasks", id);
            await deleteDoc(documentRef)
            const userRef = doc(db, "users", employeeId);
            const user = await getDoc(userRef);
            await updateDoc(userRef, {
                tasks: user.data().tasks - 1
            })
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    const [reqs, setReqs] = useState([])
    const submitRequirements = (task) => {


        setReqs(task.requirements)
        setTask(task)
        setShow2(true)
        console.log('Task: ' + JSON.stringify(reqs))


    }
    const handleUploadReq = (e, req) => {

        const somethingFiles = e.target.files;
        const object = {
            file: somethingFiles,
            req: req,
            task: task.id
        }
        const iterableArray = [object]
        setSelectedFiles([...selectedFiles, ...iterableArray]);
    }

    const restartReq = () => {

        setShow2(false)
        setSelectedFiles([])
    }

    const handleSubmitReq = async () => {
        selectedFiles.forEach((selectedFile, index) => {
            Array.from(selectedFile.file).forEach(async file => {

                const metadata = {
                    task: task.id,
                    req: selectedFile.req.value
                };

                if (task.approval) {

                    console.log('WITH APPROVAL')
                    const storageRef = ref(storage, 'approvalfiles/' + selectedFile.req.id + '/' + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

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
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    break;
                                case 'storage/canceled':
                                    break;
                                case 'storage/unknown':
                                    break;
                            }
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                console.log('File available at', downloadURL);
                                setUrl(downloadURL)
                                setDoneChecker(true)
                                let newObject = {
                                    id: selectedFile.req.id,
                                    value: selectedFile.req.value,
                                    url: downloadURL,
                                    filePath: 'approvalfiles/' + selectedFile.req.id + '/' + file.name,
                                    fileName: file.name
                                }

                                setReqArray([...reqArray, newObject])
                            });
                        }
                    );

                    let approver = ''

                    if (task.approvalTo == 'Manager') {
                        approver = 'manager@gmail.com'
                    } else if (task.approvalTo == 'CEO') {
                        approver = 'ceo@gmail.com'
                    } else if (task.approvalTo == 'Manager and CEO') {
                        approver = 'manager@gmail.com'
                    }
                    let orig = task.employeeId
                    const taskRef = doc(database, "tasks", task.id);
                    await updateDoc(taskRef, {
                        employeeId: approver,
                        status: 'for approval',
                        origUser: orig
                    });

                } else {
                    console.log('WITH NO APPROVAL')
                    const storageRef = ref(storage, 'storedFiles/' + selectedFile.req.id + '/' + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

                    const workflowRef = doc(database, "workflows", task.workflow);

                    let urlUpdate
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;

                                // ...

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                        },
                        async () => {
                            // Upload completed successfully, now we can get the download URL
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                console.log('File available at', downloadURL);
                                setUrl(downloadURL)
                                urlUpdate = url
                                await updateDoc(workflowRef, {
                                    outputs: arrayUnion({ url: downloadURL, requirement: selectedFile.req.value })
                                })
                            });
                            const docsRef = collection(database, "docs");


                            const q = query(docsRef, where("name", "==", task.project));
                            const querySnapshot = await getDocs(q);
                            querySnapshot.forEach((doc) => {
                                console.log('HEREEEEE' + doc.id, " => ", doc.data());
                            });
                            if (querySnapshot.empty) {
                                console.log('CREATING FOLDER')
                                await addDoc(collection(database, 'docs'), {
                                    createdAt: new Date(),
                                    createdBy: task.workflow,
                                    lastAccessed: new Date(),
                                    name: task.project,
                                    parent: '',
                                    path: [],
                                    updatedAt: new Date()
                                })

                            }

                            const f = query(docsRef, where("name", "==", task.workflowname));
                            const d = query(docsRef, where("name", "==", task.project));
                            const querySnapshot3 = await getDocs(f);
                            const querySnapshot4 = await getDocs(d);
                            querySnapshot4.forEach(async (doc) => {


                                if (querySnapshot3.empty) {
                                    console.log('CREATING FOLDER 2')
                                    await addDoc(collection(database, 'docs'), {
                                        createdAt: new Date(),
                                        createdBy: task.workflow,
                                        lastAccessed: new Date(),
                                        name: task.workflowname,
                                        parent: doc.id,
                                        path: [{ id: doc.id }],
                                        updatedAt: new Date()
                                    })

                                }




                            });




                            setEffectFile(file.name)
                            const querySnapshot2 = await getDocs(q)
                            if (querySnapshot2.empty) {
                                console.log('empty')
                            }
                            const g = query(docsRef, where("name", "==", task.workflowname));
                            const querySnapshot5 = await getDocs(g);
                            querySnapshot5.forEach((doc) => {
                                setFolderId2(doc.id)
                                setFolderId2Name(doc.data().name)
                            });

                            var promise = new Promise((resolve, reject) => {
                                console.log('In promise')
                                querySnapshot2.forEach((doc) => {
                                    console.log('In promise for each')


                                    setFolderId(doc.id)
                                });
                                resolve();
                            })
                        }
                    );
                }






            });
        }
        )



    }

    const viewSubmission = (task) => {

        setReqs(task.requirements)
        setTask(task)
        setShow2(true)
        console.log('Task: ' + JSON.stringify(reqs))

    }


    const approveSubmission = async () => {
        if (task.approvalTo == 'Manager and CEO' && task.employeeId == 'manager@gmail.com') {
            console.log('Giving approval to CEO')
            const taskRef = doc(database, "tasks", task.id);
            await updateDoc(taskRef, {
                employeeId: 'ceo@gmail.com',
            });
        } else {
            console.log('Approving Submission')


            reqs.forEach(async req => {


                const storageRef = ref(storage, 'storedFiles/' + req.id + '/' + req.fileName);
                const blobRef = ref(storage, req.filePath);

                let blobObj


                getBlob(blobRef).then((blob) => {
                    console.log('BLOB' + blob)
                    blobObj = blob


                    const metadata = {
                        task: task.id,
                        req: req.value
                    };
                    console.log('BLOB2' + blobObj)
                    const uploadTask = uploadBytesResumable(storageRef, blobObj, metadata);

                    const workflowRef = doc(database, "workflows", task.workflow);


                    let urlUpdate
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
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    break;
                                case 'storage/canceled':
                                    break;
                                case 'storage/unknown':
                                    break;
                            }
                        },
                        async () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                console.log('File available at', downloadURL);
                                setUrl(downloadURL)
                                urlUpdate = url

                                // Outputs workflow
                                await updateDoc(workflowRef, {
                                    outputs: arrayUnion({ url: downloadURL, requirement: req.value })

                                })

                                const desertRef = ref(storage, req.filePath);

                                deleteObject(desertRef).then(() => {
                                    console.log('Deleted: ' + req.filePath)
                                })
                            });
                            const docsRef = collection(database, "docs");


                            const q = query(docsRef, where("name", "==", task.project));
                            const querySnapshot = await getDocs(q);
                            if (querySnapshot.empty) {
                                console.log('CREATING FOLDER')
                                await addDoc(collection(database, 'docs'), {
                                    createdAt: new Date(),
                                    createdBy: task.workflow,
                                    lastAccessed: new Date(),
                                    name: task.project,
                                    parent: '',
                                    path: [],
                                    updatedAt: new Date()
                                })

                            }

                            const f = query(docsRef, where("name", "==", task.workflowname));
                            const d = query(docsRef, where("name", "==", task.project));
                            const querySnapshot3 = await getDocs(f);
                            const querySnapshot4 = await getDocs(d);
                            querySnapshot4.forEach(async (doc) => {


                                if (querySnapshot3.empty) {
                                    console.log('CREATING FOLDER 2')
                                    await addDoc(collection(database, 'docs'), {
                                        createdAt: new Date(),
                                        createdBy: task.workflow,
                                        lastAccessed: new Date(),
                                        name: task.workflowname,
                                        parent: doc.id,
                                        path: [{ id: doc.id }],
                                        updatedAt: new Date()
                                    })

                                }
                            });
                            setEffectFile(req.fileName)
                            const querySnapshot2 = await getDocs(q)
                            const g = query(docsRef, where("name", "==", task.workflowname));
                            const querySnapshot5 = await getDocs(g);
                            querySnapshot5.forEach((doc) => {
                                setFolderId2(doc.id)
                                setFolderId2Name(doc.data().name)
                            });

                            var promise = new Promise((resolve, reject) => {
                                console.log('In promise')
                                querySnapshot2.forEach((doc) => {
                                    console.log('In promise for each')
                                    setFolderId(doc.id)
                                });
                                resolve();
                            })
                        }
                    );


                })

            }
            );
        }



    }
    const rejectSubmission = async () => {

        const taskRef = doc(database, "tasks", task.id);
        const docSnap = await getDoc(taskRef);

        await updateDoc(taskRef, {
            status: 'for submission',
            employeeId: docSnap.data().origUser,
            reason: reason
        });

        await addDoc(collection(database, "notifs"), {
            title: `REJECTED: ${task.task} from ${task.workflowname}`,
            date: new Date(),
            content: `Your submission for the task ${task.task} from ${task.workflowname} was rejected. Please work on it again`,
            receiver: task.origUser


        });


    }
    const createPlan = async () => {

        console.log('INSIDE CREATE PLAN')

        const planRef = doc(collection(database, "plans"));

        await setDoc(planRef, {
            name: planCreate,
            project: project
        });

        window.location.reload()

    }

    const addInput = () => {
        setInputs([...inputs, { requirement: '', employee: '' }]);
    };

    const handleTextboxChange = (index, event) => {
        const newInputs = [...inputs];
        newInputs[index].requirement = event.target.value;
        setInputs(newInputs);
    };

    const handleDropdownChange = (index, event) => {
        const newInputs = [...inputs];
        newInputs[index].employee = event.target.value;

        console.log('employee = ' + event.target.value)
        setInputs(newInputs);
    };

    const setStageAndWorkflow = async (stageId) => {


        const docRef = doc(database, "stages", stageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(docSnap.data().task)
            setStage(docSnap.data().task)
            setworkflowOfStage(docSnap.data().workflowname)
            setworkflowIdOfStage(docSnap.data().workflow)
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

    };

    useEffect(() => {
        console.log(selectedFiles);
    }, [selectedFiles]);

    useEffect(async () => {
        if (firstRender2) {
            setFirstRender2(false);
            return;
        }

        console.log('URL :' + url)
        console.log('REQ ARRAY: ' + JSON.stringify(reqArray))
        if (reqArray != []) {
            const taskRef = doc(database, "tasks", task.id);
            await updateDoc(taskRef, {
                requirements: reqArray
            });
        }
    }, [reqArray]);

    useEffect(async () => {

        if (firstRender) {
            setFirstRender(false);
            return;
        }


        const docRef = doc(database, "docs", folderId);


        const workflowSnap = await getDoc(docRef)

        dispatch(
            addFileUser({
                uid: userId,
                parent: folderId2,
                data: "",
                name: effectFile,
                url: url,
                path: [{ id: folderId, name: workflowSnap.data().name }, { id: folderId2, name: folderId2Name }],
            })
        );


        const workflowRef = doc(database, "workflows", task.workflow);
        const docSnap = await getDoc(workflowRef);



        let isTaskActive = false
        let endWorkflow = true
        let done = false
        let updateTaskArray = []
        docSnap.data().tasks.forEach(async (task1, index) => {





            console.log('task 1' + JSON.stringify(task1))

            if (isTaskActive) {

                console.log('Creating task for yet to activate stage')
                endWorkflow = false

                const setTasksRef = doc(database, 'tasks', task1.parentId)
                const stageRef = doc(database, 'stages', task1.parentId)
                if (task1.assignTo) {
                    console.log('Automatic Stage')
                    const q = query(collection(database, "users"), where('name', '==', task1.assignTo))
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (user) => {
                        console.log('USER: ' + user)
                        await setDoc(setTasksRef, {
                            task: task1.name,
                            isChecked: false,
                            timestamp: serverTimestamp(),
                            deadline: 'None',
                            employee: user.data().name,
                            employeeId: user.data().email,
                            requirements: task1.requirements,
                            status: 'for submission',
                            approval: task1.approval,
                            workflow: task1.workflow,
                            workflowname: task1.workflowname,
                            approvalTo: task1.approvalTo,
                            recurring: task1.recurring,
                            project: task.project
                        })
                    })
                } else {
                    console.log('Manual Stage')
                    await setDoc(stageRef, {
                        task: task1.name,
                        workflow: task1.workflow,
                        workflowname: task1.workflowname,
                    })
                }
                done = true
            }
            if (done) {
                console.log('DONE')
            }

            //brush off
            if (!task1.active && !isTaskActive && !done) {
                console.log('brush off')
                if (updateTaskArray = []) {
                    updateTaskArray = [task1]
                } else {
                    updateTaskArray.push(task1)
                }

            }

            //make active task inactive

            if (task1.active && !done) {
                console.log('make active task inactive')

                if (task1.manualTasks) {
                    updateTaskArray.push({
                        active: false,
                        approval: task1.approval,
                        approvalTo: task1.approvalTo,
                        assignTo: task1.assignTo,
                        employeeManual: task1.employeeManual,
                        manualTasks: task1.manualTasks,
                        name: task1.name,
                        parentId: task1.parentId,
                        recurring: task1.recurring,
                        requirements: task1.requirements,
                        workflow: task1.workflow,
                        workflowName: task1.workflow
                    })
                } else {
                    updateTaskArray.push({
                        active: false,
                        manualTasks: task1.manualTasks,
                        name: task1.name,
                        parentId: task1.parentId,
                        workflow: task1.workflow,
                        workflowName: task1.workflow
                    })
                }


            }


            //finished activating task
            if (done && !isTaskActive) {
                console.log('finished activating task')
                updateTaskArray.push(task1)
            }

            //make inactive task active
            if (done && isTaskActive) {
                console.log('make inactive task active')

                if (task1.manualTasks) {
                    updateTaskArray.push({
                        active: true,
                        approval: task1.approval,
                        approvalTo: task1.approvalTo,
                        assignTo: task1.assignTo,
                        employeeManual: task1.employeeManual,
                        manualTasks: task1.manualTasks,
                        name: task1.name,
                        parentId: task1.parentId,
                        recurring: task1.recurring,
                        requirements: task1.requirements,
                        workflow: task1.workflow,
                        workflowName: task1.workflow
                    })
                } else {
                    updateTaskArray.push({
                        active: true,
                        manualTasks: task1.manualTasks,
                        name: task1.name,
                        parentId: task1.parentId,
                        workflow: task1.workflow,
                        workflowName: task1.workflow
                    })
                }
                isTaskActive = false
            }

            //Recognize task is active and create a task for next task
            if (task1.active && !isTaskActive && !done) {

                console.log('Recognize next task is active and create a task for next task')
                isTaskActive = true
            }

            console.log('Task = ' + task1)

        })

        if (!task.recurring) {
            await updateDoc(doc(database, "tasks", task.id), {
                status: 'done'
            });
        } else {
            await updateDoc(doc(database, "tasks", task.id), {
                assignTo: task.origUser,
                status: 'for submission'
            });
        }
        console.log('updated task = ' + JSON.stringify(updateTaskArray))
        await updateDoc(workflowRef, {
            tasks: updateTaskArray
        })

        toast('FINISHED')
    }, [folderId]);

    useEffect(async () => {

        if (firstRender3) {
            setFirstRender3(false);
            return;
        }

        setLoading(false)
    }, [tasks]);


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
                    <h2>Task Manager</h2> <Button onClick={() => setShow(true)}>Add Task</Button>
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>

                        <h5>Pending Tasks</h5>
                        <p></p>
                        <div className='cards-container'>
                            {tasks.map((task, index) => {
                                if (user.data.uid === task.employeeId && task.status != 'done' && !task.manualTasks) {
                                    return (
                                        <>
                                            {task.status == 'for submission' && (
                                                <>

                                                    <Card className='card' border="secondary" style={{ width: '18rem' }} key={index}>
                                                        <Card.Header>{task.project}</Card.Header>
                                                        <Card.Body>
                                                            <Card.Title>{task.task}</Card.Title>
                                                            {task.status === 'for submission' ?
                                                                <Button variant="primary" onClick={() => submitRequirements(task)}>Submit</Button>
                                                                :
                                                                <Button variant="primary" onClick={() => viewSubmission(task)}>View</Button>
                                                            }
                                                        </Card.Body>
                                                        <ListGroup className="list-group-flush">
                                                            <ListGroup.Item>Deadline : {task.deadline}</ListGroup.Item>
                                                            <ListGroup.Item>Date : {new Date(task.timestamp.seconds * 1000).toLocaleString()}</ListGroup.Item>
                                                            <ListGroup.Item>Assigned To : {task.employee}</ListGroup.Item>
                                                        </ListGroup>
                                                    </Card>




                                                </>
                                            )}

                                        </>
                                    )
                                }
                            }
                            )}
                        </div>
                        <h5>Pending Approvals</h5>
                        <p></p>
                        <div className='cards-container'>
                            {tasks.map((task, index) => {
                                {
                                    task.status == 'for approval' && (
                                        <>
                                            <Card className='card' border="secondary" style={{ width: '18rem' }} key={index}>
                                                <Card.Header>{task.project}</Card.Header>
                                                <Card.Body>
                                                    <Card.Title>{task.task}</Card.Title>
                                                    {task.status === 'for submission' ?
                                                        <Button variant="primary" onClick={() => submitRequirements(task)}>Submit</Button>
                                                        :
                                                        <Button variant="primary" onClick={() => viewSubmission(task)}>View</Button>
                                                    }
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroup.Item>Deadline : {task.deadline}</ListGroup.Item>
                                                    <ListGroup.Item>Date : {new Date(task.timestamp.seconds * 1000).toLocaleString()}</ListGroup.Item>
                                                    <ListGroup.Item>Assigned To : {task.employee}</ListGroup.Item>
                                                </ListGroup>
                                            </Card>


                                        </>
                                    )
                                }



                            })}
                        </div>

                    </div>
                    <TaskMonitoring></TaskMonitoring>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <select onChange={(e) => setProject(e.target.value)}>
                            <option value="">Select Project</option>
                            <option value="Miramonti">Miramonti</option>
                            <option value="Monumento">Monumento</option>
                            <option value="Montecristo">Montecristo</option>
                            <option value="Muramana">Muramana</option>
                        </select>
                        {project !== '' && (
                            <>
                                <p>Select Stage&nbsp;&nbsp;&nbsp;
                                    <select onChange={(e) => setStageAndWorkflow(e.target.value)}>
                                        <option value="">Select Stage</option>
                                        {stages.map((stage, index) => (
                                            <option key={index} value={stage.id}>
                                                {stage.task}
                                            </option>
                                        ))}
                                    </select>

                                </p>
                                <p>Select Plan&nbsp;&nbsp;&nbsp;
                                    <select onChange={(e) => setPlan(e.target.value)}>
                                        <option value="">Select Plan</option>
                                        {plans.map((plans, index) => (
                                            <option key={index} value={plans.name}>
                                                {plans.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShow4(true)}>Create Plan</button>

                                </p>
                                {inputs.map((input, index) => (
                                    <p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Add Description"
                                            value={input.requirement}
                                            onChange={(event) => handleTextboxChange(index, event)}
                                        />
                                        <select
                                            value={input.employee}
                                            onChange={(event) => handleDropdownChange(index, event)}>
                                            <option value="">Select employee</option>
                                            {users.map((users, index) => (
                                                <option key={index} value={users.email}>
                                                    {users.name} &#40;Tasks: {users.tasks}&#41;
                                                </option>
                                            ))}
                                        </select>

                                    </p>
                                ))}
                                <button onClick={addInput}>Add Requirement</button>
                                <p>Estimated Hours:    <input type="number" id="quantity" name="quantity" onChange={(e) => setHours(e.target.value)} />
                                </p>
                                <p>Set Deadline:  <input type="date" onChange={(e) => setDeadline(e.target.value)} /> </p>

                            </>

                        )}


                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                        <button className="btn btn-primary" onClick={submitTask}>Create Task</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={show2} onHide={() => restartReq()} >
                    {task && task.status === 'for submission' ?
                        <Modal.Header closeButton> Submit Requirements</Modal.Header> :
                        <Modal.Header closeButton> Approve Submission</Modal.Header>}

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            </Form.Group>
                            {reqs.map((req, index) =>
                                <>
                                    <p>
                                        {req.value}:
                                        {task.status === 'for submission' ?
                                            <input
                                                type="file"
                                                onChange={(e) => handleUploadReq(e, req)}
                                                multiple /> :
                                            <a href={req.url} target="_blank">View</a>}
                                        {task.reason && task.status == 'for submission' && (
                                            <p> Reason for Disapproval : {task.reason}</p>
                                        )}
                                    </p>
                                </>
                            )}
                            <Modal.Footer>
                                <Button variant='secondary' onClick={() => setShow2(false)}>Close</Button>
                                {task && task.status === 'for submission' ? <Button variant="primary" onClick={() => handleSubmitReq()}>Submit</Button> : (<><Button variant="primary" onClick={() => approveSubmission(task)}>Approve</Button><Button variant="tertiary" onClick={() => setShow3(true)}>Decline</Button></>)}

                                {task && task.status === 'for approval' && task.recurring === true && <Button >Approve and Continue </Button>}
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={show3} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reason for Disapproval</Modal.Title>
                    </Modal.Header>
                    <Form.Control
                        as='textarea'
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose2}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => rejectSubmission()}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show4} onHide={handleClose4}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Plan for {project}</Modal.Title>
                    </Modal.Header>
                    <Form.Control
                        type='text'
                        onChange={(e) => setPlanCreate(e.target.value)}
                    />
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose4}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => createPlan()}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }


}
export default Home
