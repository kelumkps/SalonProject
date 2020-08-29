import React from 'react';
import QrReader from 'react-qr-reader';
import Button from 'react-bootstrap/Button';
import { notificationService } from '../services/NotificationService';
import { progressService } from '../services/ProgressService';

class VerifyUser extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            delay: 100,
            progress: 0,
            legacyMode: false
        }
        this.qrReaderRef = React.createRef();
    }

    componentDidMount() {
        progressService.clearProgress();
    }

    async handleScan(ticketId) {
        if (ticketId) {
            const interval = setInterval(() => {
                let currentProgress = this.state.progress;
                if (currentProgress < 90) {
                    currentProgress = currentProgress + 1;
                    this.setState({ progress: currentProgress });
                    progressService.setCurrentProgress(this.state.progress);
                }
            }, 50);
            try {
                let response = await fetch(`http://localhost:8080/api/tickets/${ticketId}`)
                .then((response) => {
                    if (response.status >= 400 && response.status < 600) {
                        throw new Error(response.status);
                    }
                    return response;
                });
                let ticket = await response.json();
                clearInterval(interval);
                this.setState({ progress: 100 });
                progressService.setCurrentProgress(this.state.progress);
                this.setState({ ticket: ticket });
            } catch(err) {
                this.setState({ progress: 100 });
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
    }

    handleError(err) {
        this.setState({ legacyMode: true })
    }

    openImageDialog() {
        this.qrReaderRef.current.openImageDialog()
    }

    render() {
        const { delay, ticket, legacyMode } = this.state;
        if (ticket) {
            let serviceName = `${ticket.payment.slot.selectedService.name} 
                @ ${(new Date(ticket.payment.slot.slotFor)).toLocaleString()} 
                By ${ticket.payment.slot.stylistName}`;
            return(
                <div>
                    <div className="row"><div className="col-12"><br/></div></div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-11"><h3>Ticket Details</h3></div>
                    </div>
                    <div className="row"><div className="col-12"><br/></div></div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5"><strong>Service Details</strong></div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                    <div className="col-1"></div>
                        <div className="col-5">{serviceName}</div>
                        <div className="col-5"><Button variant="primary" onClick={(e) => this.setState({ticket : undefined})} >Scan Another</Button></div>
                        <div className="col-1"></div>
                    </div>
                    <div className="row"><div className="col-12"><br/></div></div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5"><strong>User Information</strong></div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">{ticket.payment.firstName} {ticket.payment.lastName}</div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">{ticket.payment.email}</div>
                        <div className="col-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-5">Phone {ticket.payment.phone}</div>
                        <div className="col-6"></div>
                    </div>
                </div>
            );
        } else {
            const hozContainerStyle = legacyMode ? { width: '100%', maxWidth: '500px' } : {};
            return(
                <div style={hozContainerStyle}>
                    <QrReader
                        ref={this.qrReaderRef}
                        delay={delay}
                        onError={(err) => this.handleError(err)}
                        onScan={(r) => this.handleScan(r)}
                        legacyMode={legacyMode}
                    />
                    { legacyMode ?
                        <Button variant="primary" onClick={(e) => this.openImageDialog()} >Submit QR Code</Button>
                        : <div></div>
                    }
                </div>
            );
        }
    }
}

export default VerifyUser;