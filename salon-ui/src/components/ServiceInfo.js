import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter  } from "react-router";

class ServiceInfo extends React.Component {

    onClickBook(info) {
        this.props.history.push(`/chooseslot/${info.id}/${info.name}`);
    }

    render() {
        const {info} = this.props;
        return (
            <Card>
                <Card.Header as="h5">{info.name}</Card.Header>
                <Card.Body>
                    <Card.Title>${info.price}</Card.Title>
                    <Card.Text>
                        {info.description} {info.timeInMinutes}
                    </Card.Text>
                    <Button variant="outline-primary" onClick={(e) => this.onClickBook(info)} >Book Now</Button>
                </Card.Body>
            </Card>
        );

    };

}

export default withRouter(ServiceInfo);