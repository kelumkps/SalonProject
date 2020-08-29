import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {ElementsConsumer, CardElement} from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import { paymentService } from '../services/PaymentService';
import { notificationService } from '../services/NotificationService';
import { progressService } from '../services/ProgressService';

class PayWithStripe extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            progress: 0,
            isSubmitting: false
        };
    }


    handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        this.setState({
            isSubmitting: true
        });

        const interval = setInterval(() => {
            let currentProgress = this.state.progress;
            if (currentProgress < 90) {
                currentProgress = currentProgress + 1;
                this.setState({ progress: currentProgress });
                progressService.setCurrentProgress(this.state.progress);
            }
        }, 50);

        const {stripe, elements} = this.props;
        const {clientSecret, clientName} = this.props.props;

        if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make  sure to disable form submission until Stripe.js has loaded.
            return;
        }
        const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
            name: clientName,
            },
        }
        });

        this.setState({
            isSubmitting: false
        });

        clearInterval(interval);
        this.setState({ progress: 100 });
        progressService.setCurrentProgress(this.state.progress);
        setTimeout(() => {
            progressService.clearProgress();
            this.setState({ progress: 0 });
        }, 1000);

        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            notificationService.notifyError("Something went wrong! : " + result.error.message);
        } else {
        // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                paymentService.paymentProcessed({});
            }
        }
    };

    render() {
        return (
            <div>
                <div className="row"><div className="col-12"><br/></div></div>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-11"><strong>Enter Card Details</strong></div>
                </div>
                <div className="row"><div className="col-12"><br/></div></div>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-6">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="cardSelection">
                                <CardSection />
                            </Form.Group>
                            <Button disabled={!this.props.stripe || this.state.isSubmitting} variant="success" type="submit">Pay</Button>
                        </Form>
                    </div>
                    <div className="col-5"></div>
                </div>
            </div>
        );
    }
};

export default function InjectedPayWithStripe(props) {
    return (
    <ElementsConsumer>
        {({stripe, elements}) => (
        <PayWithStripe  stripe={stripe} elements={elements} props={props}/>
        )}
    </ElementsConsumer>
    );
}
