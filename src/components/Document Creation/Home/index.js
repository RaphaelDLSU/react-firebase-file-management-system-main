import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc, QueryConstraint } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

const DocumentCreation = () => {
    const database = getFirestore()
    const [loading, setLoading] = useState(true)

    const [open, setOpen] = useState(false);

    const [inputs, setInputs] = useState({});
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [sum, setSum] = useState('');
    
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form data:', inputs);

        const documentRef = collection(database,'buildingSurface')

        await addDoc(documentRef,{
            inputs:inputs
        })
    };

    const addition = (e, inputNumber) => {
        const inputValue = e.target.value;

        if (inputNumber === 'number1') {
            setNumber1(inputValue);
        } else if (inputNumber === 'number2') {
            setNumber2(inputValue);
        }

        const result = Number(number1) + Number(number2);
        setSum(result);
    }
    
    const handleAddition = (number1, number2) => {
        const sum = Number(number1) + Number(number2);
            setSum(sum);
    };

    return (
        <div className="form" style={{ padding: '20px' }}>
            <h2>Document Creation</h2>
            <hr></hr>
            <h3>Ground Floor</h3>
            <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            >
            Show
            </Button>
            <Collapse in={open}>
                <Form onSubmit={handleSubmit}>
                    <h4>Description of the Saleable Area</h4>
                    <Table striped>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Unit No./Tag</th>
                            <th>Type</th>
                            <th>Area (sqm)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>C01</td>
                            <td>Commercial Retail</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>C02</td>
                            <td>Commercial Retail</td>
                            <td>20</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>C03</td>
                            <td>Commerical Retail</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>TOTAL</td>
                            <td>60</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Form.Group>
                        <Row>
                            <Col>
                                <Form.Control placeholder="Unit No./Tag" />
                            </Col>
                            <Col>
                                <Form.Select aria-label="Default select example">
                                    <option>Select saleable area type</option>
                                    <option value="Commerical Retail">Commerical Retail</option>
                                    <option value="Restaurant">Restaurant</option>
                                    <option value="Conference">Conference</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Control placeholder="Area (sqm)" />
                            </Col>
                            <Col>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                    <br/>
                    <h4>Description of the Service Area</h4>
                    <Table striped>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Unit No./Tag</th>
                            <th>Type</th>
                            <th>Area (sqm)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>C01</td>
                            <td>Commercial Retail</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>C02</td>
                            <td>Commercial Retail</td>
                            <td>20</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>C03</td>
                            <td>Commerical Retail</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>TOTAL</td>
                            <td>60</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Form.Group>
                        <Row>
                            <Col>
                                <Form.Control placeholder="Unit No./Tag" />
                            </Col>
                            <Col>
                                <Form.Select aria-label="Default select example">
                                    <option>Select saleable area type</option>
                                    <option value="Commerical Retail">Commerical Retail</option>
                                    <option value="Restaurant">Restaurant</option>
                                    <option value="Conference">Conference</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Control placeholder="Area (sqm)" />
                            </Col>
                            <Col>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Collapse>
        </div>

        // <form onSubmit={handleSubmit}>
        //   <label>
        //     Project Name:
        //     <input
        //       type="text"
        //       name="projectName"
        //       value={inputs.projectName || ""}
        //       onChange={handleChange}
        //     />
        //   </label>
        //   <br />
        //   <label>
        //     Location:
        //     <input
        //       type="text"
        //       name="location"
        //       value={inputs.location || ""}
        //       onChange={handleChange}
        //     />
        //   </label>
        //   <fieldset class="buildingSurface">
        //     <legend>Total Building Surface</legend>
        //     <label>Lot area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="lotArea"
        //          value={inputs.lotArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Total Gross Floor Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="totalGrossFloorArea"
        //          value={inputs.totalGrossFloorArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <br />
        //     <p>Commercial</p>
        //     <label>Commercial Gross Floor Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="commercialGrossFloorArea"
        //          value={inputs.commercialGrossFloorArea || ""}
        //          onChange={handleChange}
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Commercial Saleable Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="commercialSaleableArea"
        //          value={inputs.commercialSaleableArea || ""}
        //          onChange={handleChange} 
        //         /> sqm */}
        //         <input 
        //         type="number"
        //         value={number1}
        //         onChange={(e) => addition(e, 'number1')}
        //         />
        //     </label>
        //     <br />
        //     <label>Commercial Service Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="commercialServiceArea"
        //          value={inputs.commercialServiceArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Efficiency Ratio: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="commercialEfficiencyRatio"
        //          value={inputs.commercialEfficiencyRatio || ""}
        //          onChange={handleChange} 
        //         /> [%]
        //     </label>
        //     <br />
        //     <label>Number of Commercial Units: 
        //         <input
        //          type="number"
        //          name="commercialUnits"
        //          value={inputs.commercialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of Parking Slots: 
        //         <input
        //          type="number"
        //          name="commercialParkingSlots"
        //          value={inputs.commercialParkingSlots || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <br />
        //     <p>Residential</p>
        //     <label>Residential Gross Floor Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="residentialGrossFloorArea"
        //          value={inputs.residentialGrossFloorArea || ""}
        //          onChange={handleChange}
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Residential Saleable Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="residentialSaleableArea"
        //          value={inputs.residentialSaleableArea || ""}
        //          onChange={handleChange} 
        //         /> sqm */}
        //         <input 
        //         type="number"
        //         value={number2}
        //         onChange={(e) => addition(e, 'number2')}
        //         />
        //     </label>
        //     <br />
        //     <label>Residential Service Area: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="residentialServiceArea"
        //          value={inputs.residentialServiceArea || ""}
        //          onChange={handleChange} 
        //         /> sqm
        //     </label>
        //     <br />
        //     <label>Efficiency Ratio: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="residentialEfficiencyRatio"
        //          value={inputs.residentialEfficiencyRatio || ""}
        //          onChange={handleChange} 
        //         /> [%]
        //     </label>
        //     <br />
        //     <label>Number of Residential Units: 
        //         <input
        //          type="number"
        //          name="residentialUnits"
        //          value={inputs.residentialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of Studio Units: 
        //         <input
        //          type="number"
        //          name="studioUnits"
        //          value={inputs.studioUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of 1 Bedroom Units: 
        //         <input
        //          type="number"
        //          name="oneBedroomUnits"
        //          value={inputs.oneBedroomUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Number of Parking Slots: 
        //         <input
        //          type="number"
        //          name="residentialParkingSlots"
        //          value={inputs.residentialParkingSlots || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <br />
        //     <p>Gross and Total Values</p>
        //     <label>Gross Saleable Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="grossSaleableArea"
        //          value={inputs.grossSaleableArea || ""}
        //          onChange={handleChange}
        //         /> sqm */}
        //         <p>{sum}</p>
        //     </label>
        //     <br />
        //     <label>Gross Service Area: 
        //         {/* <input
        //          type="number"
        //          step="0.01"
        //          name="grossServiceArea"
        //          value={inputs.grossServiceArea || ""}
        //          onChange={handleChange} 
        //         /> sqm */}
        //     </label>
        //     <br />
        //     <label>Efficiency Ratio: 
        //         <input
        //          type="number"
        //          step="0.01"
        //          name="grossEfficiencyRatio"
        //          value={inputs.grossEfficiencyRatio || ""}
        //          onChange={handleChange} 
        //         /> [%]
        //     </label>
        //     <br />
        //     <label>Total Number of Commercial Units: 
        //         <input
        //          type="number"
        //          name="totalCommercialUnits"
        //          value={inputs.totalCommercialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of Residential Units: 
        //         <input
        //          type="number"
        //          name="totalResidentialUnits"
        //          value={inputs.totalResidentialUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of Studio Units: 
        //         <input
        //          type="number"
        //          name="totalStudioUnits"
        //          value={inputs.totalStudioUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of 1 Bedroom Units: 
        //         <input
        //          type="number"
        //          name="totalOneBedroomUnits"
        //          value={inputs.totalOneBedroomUnits || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //     <label>Total Number of Parking Slots: 
        //         <input
        //          type="number"
        //          name="totalParkingSlots"
        //          value={inputs.totalParkingSlots || ""}
        //          onChange={handleChange} 
        //         />
        //     </label>
        //     <br />
        //   </fieldset>
        //   <br />
        //   <input type="submit" />
        // </form>
    );
};

export default DocumentCreation;
