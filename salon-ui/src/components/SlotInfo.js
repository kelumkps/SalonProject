import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter  } from "react-router";

class SlotInfo extends React.Component {
    formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    onClickBook(info, serviceId, serviceName) {
        this.props.history.push(`/makepayment/${info.id}/${serviceId}/${serviceName}`);
    }

    render() {
        const {info, serviceId, serviceName} = this.props;
        return (
            <Card>
                <Card.Header as="h5">{serviceName}</Card.Header>
                <Card.Body>
                    <Card.Title>{info.stylistName}</Card.Title>
                    <Card.Text>
                        Slot Time {this.formatAMPM(new Date(info.slotFor))}
                    </Card.Text>
                    <Button variant="outline-primary" onClick={(e) => this.onClickBook(info, serviceId, serviceName)} >Book This Slot</Button>
                </Card.Body>
            </Card>
        );

    };

}

export default withRouter(SlotInfo);