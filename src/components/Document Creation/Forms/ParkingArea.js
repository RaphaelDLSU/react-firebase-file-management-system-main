import React from "react";
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ParkingArea = () => {
    return (
        <div className="floorForm">
            <Table striped>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Unit No./Tag</th>
                    <th>No. of Parking</th>
                    <th>Slot size (sqm)</th>
                    <th>Total Area (sqm)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>C01</td>
                    <td>5</td>
                    <td>10</td>
                    <td>10</td>
                </tr>
                <tr>
                    <td colSpan={2}>TOTAL</td>
                    <td colSpan={2}>60</td>
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
                            <option>Select service area type</option>
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
        </div>
    );
}

export default ParkingArea;