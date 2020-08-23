import React from 'react';
import GetBillingDetails from './GetBillingDetails';
import PayWithStripe from './PayWithStripe';
import ShowConfirmedTicket from './ShowConfirmedTicket';
import { paymentService } from '../services/PaymentService';

class PaymentContainer extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params } } = this.props;
        
        this.state = {
            slotId: params.slotId,
            serviceId: params.serviceId,
            serviceName: params.serviceName,
            paymentFlow: 'BILLING_DETAILS'
        };
    }

    componentDidMount() {
        this.subscription = paymentService.getService().subscribe(paymentEvent => {
            const {event, payload} = paymentEvent;
            if (event === 'PAYMENT_INITIATED') {
                const { id, clientSecret, firstName, lastName} = payload;
                this.setState({ 
                    paymentId : id,
                    clientSecret : clientSecret,
                    clientName : `${firstName} ${lastName}`,
                    paymentFlow : 'PAY_WITH_STRIPE'
                });
            } else if (event === 'PAYMENT_PROCESSED') {
                this.setState({ 
                    paymentFlow : 'SHOW_CONFIRMATION'
                });
            }
        });
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }


    render() {
        let { paymentFlow, slotId, serviceId, clientSecret, clientName,  paymentId} = this.state;

        if (paymentFlow === 'BILLING_DETAILS') {
            return (
                <div>
                    <GetBillingDetails slotId={slotId} serviceId={serviceId}/>
                </div>
            );  
        } else if (paymentFlow === 'PAY_WITH_STRIPE') {
            return (
                <div>
                    <PayWithStripe clientSecret={clientSecret} clientName={clientName}/>
                </div>
            )
        } else if (paymentFlow === 'SHOW_CONFIRMATION') {
            return (
                <div>
                    <ShowConfirmedTicket paymentId={paymentId}/>
                </div>
            )
        } else {
            return (<div/>);
        }
    }
}

export default PaymentContainer;