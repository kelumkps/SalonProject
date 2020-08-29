import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { paymentService } from '../services/PaymentService';
import { notificationService } from '../services/NotificationService';
import { progressService } from '../services/ProgressService';

class GetBillingDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validated : false,
            progress: 0
        };
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const {firstName, lastName, email, phoneNumber} = this.state;
        const {slotId, serviceId} = this.props;
        const interval = setInterval(() => {
            let currentProgress = this.state.progress;
            if (currentProgress < 90) {
                currentProgress = currentProgress + 1;
                this.setState({ progress: currentProgress });
                progressService.setCurrentProgress(this.state.progress);
            }
        }, 50);
        try {
            let response = await fetch('http://localhost:8080/api/payments/initiate', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    salonServiceDetailID: serviceId,
                    slotId: slotId
                })
            }).then((response) => {
                if (response.status >= 400 && response.status < 600) {
                    throw new Error(response.status);
                }
                return response;
            });
            let payment = await response.json();
            clearInterval(interval);
            this.setState({ progress: 100 });
            progressService.setCurrentProgress(this.state.progress);
            setTimeout(() => {
                progressService.clearProgress();
                this.setState({ progress: 0 });
            }, 1000);
            paymentService.paymentInitiated(payment);
        } catch(err) {
            clearInterval(interval);
            this.setState({ progress: 100 });
            progressService.setCurrentProgress(this.state.progress);
            notificationService.notifyError("Something went wrong! : " + err);
            setTimeout(() => {
                progressService.clearProgress();
                this.setState({ progress: 0 });
            }, 1000);
        }
    }

    render() {
        return (
            <div>
                <div className="row"><div className="col-12"><br/></div></div>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-11"><strong>Enter Billing Details</strong></div>
                </div>
                <div className="row"><div className="col-12"><br/></div></div>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="firstName" onChange={(e) => this.handleInputChange(e)} required placeholder="Enter first name" />
                            </Form.Group>

                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="lastName" onChange={(e) => this.handleInputChange(e)} required placeholder="Enter last name" />
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" name="email" onChange={(e) => this.handleInputChange(e)} required placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="phoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="text" name="phoneNumber" onChange={(e) => this.handleInputChange(e)} required placeholder="Enter phone number" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Make Payment
                            </Button>
                        </Form>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>
        );
    }
}

export default GetBillingDetails;