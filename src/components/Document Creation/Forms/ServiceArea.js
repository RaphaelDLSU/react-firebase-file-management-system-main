import React from "react";
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ServiceArea = () => {
    return (
        <div className="floorForm">
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
                            <option>Select service area type</option>
                            <option value="Roadway/Common Area">Roadway/Common Area</option>
                            <option value="Stairs">Stairs</option>
                            <option value="Transformer Room">Transformer Room</option>
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

export default ServiceArea;