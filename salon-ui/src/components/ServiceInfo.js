import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

function ServiceInfo(props) {
    const {info} = props;
    return (
        <Card>
            <Card.Header as="h5">{info.name}</Card.Header>
            <Card.Body>
                <Card.Title>${info.price}</Card.Title>
                <Card.Text>
                    {info.description} {info.timeInMinutes}
                </Card.Text>
                <Button variant="outline-primary">Book Now</Button>
            </Card.Body>
        </Card>
        );
};

export default ServiceInfo;