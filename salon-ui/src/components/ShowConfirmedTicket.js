import React from 'react';
import QRCode from 'qrcode.react';
import { notificationService } from '../services/NotificationService';
import { progressService } from '../services/ProgressService';

class ShowConfirmedTicket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0
        };
    }

    async componentDidMount() {
        const {paymentId} = this.props;
        const interval = setInterval(() => {
            let currentProgress = this.state.progress;
            if (currentProgress < 90) {
                currentProgress = currentProgress + 1;
                this.setState({ progress: currentProgress });
                progressService.setCurrentProgress(this.state.progress);
            }
        }, 50);
        try {
            let response = await fetch(`http://localhost:8080/api/payments/confirm/${paymentId}`, {
                method: "PUT"
            }).then((response) => {
                if (response.status >= 400 && response.status < 600) {
                    throw new Error(response.status);
                }
                return response;
            });
            let bookingInfo = await response.json();
            clearInterval(interval);
            this.setState({ progress: 100 });
            progressService.setCurrentProgress(this.state.progress);
            let serviceName = `${bookingInfo.ticket.payment.slot.selectedService.name} 
            @ ${(new Date(bookingInfo.ticket.payment.slot.slotFor)).toLocaleString()} 
            By ${bookingInfo.ticket.payment.slot.stylistName}`;
            this.setState({ 
                salonDetails: bookingInfo.salonDetails,
                ticketId: `${bookingInfo.ticket.id}`,
                serviceName : serviceName
            });
        } catch(err) {
            clearInterval(interval);
            this.setState({ progress: 100 });
            progressService.setCurrentProgress(this.state.progress);
            notificationService.notifyError("Something went wrong! : " + err);
        }
        setTimeout(() => {
            progressService.clearProgress();
            this.setState({ progress: 0 });
        }, 1000);
    }

    render() {
        const {salonDetails, ticketId, serviceName} = this.state;
        if (ticketId) {
            return (
                <div>
                    <div className="row"><div className="col-12"><br/></div></div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-11"><h3>Your Ticket Details</h3></div>
                    </div>
                    <div className="row"><div className="col-12"><br/></div></div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5"><strong>Service Details</strong></div>
                        <div className="col-5"><strong>Take a Picture of the below code and present it to admin</strong></div>
                        <div className="col-1"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">{serviceName}</div>
                        <div className="col-5"><QRCode value={ticketId}/></div>
                        <div className="col-1"></div>
                    </div>
                    <div className="row"><div className="col-12"><br/></div></div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5"><strong>Salon Address Details</strong></div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">{salonDetails.name}</div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">{salonDetails.address}</div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">{salonDetails.city}</div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">{salonDetails.state} {salonDetails.zipcode}</div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">Phone {salonDetails.phone}</div>
                        <div className="col-6"></div>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }
    }
}

export default ShowConfirmedTicket;