import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import SlotInfo from './SlotInfo';
import { notificationService } from '../services/NotificationService';
import { progressService } from '../services/ProgressService';

class ChooseSlot extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params } } = this.props;

        this.state = {
            serviceId: params.serviceId,
            serviceName: params.serviceName,
            slotDate: '',
            progress: 0,
            slots: []
        };
    }

    componentDidMount() {
        progressService.clearProgress();
    }

    setDate(date){
        this.setState({
            "slotDate" : date
        })
    }

    async fetchslots() {
        const {slotDate, serviceId} = this.state;
        const interval = setInterval(() => {
            let currentProgress = this.state.progress;
            if (currentProgress < 90) {
                currentProgress = currentProgress + 1;
                this.setState({ progress: currentProgress });
                progressService.setCurrentProgress(this.state.progress);
            }
        }, 50);
        try {
            const url = `http://localhost:8080/api/services/retrieveAvailableSlots?serviceId=${serviceId}&slotFor=${slotDate}`
            let response = await fetch(url);
            let slots = await response.json();
            clearInterval(interval);
            this.setState({ progress: 100 });
            progressService.setCurrentProgress(this.state.progress);
            this.setState({ slots: slots });
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

    showSlotsOnDate() {
        const {slotDate} = this.state;
        const todayDate = new Date(new Date().toISOString().substring(0, 10));
        const selectedDate = new Date(slotDate);
        if (selectedDate < todayDate) {
            notificationService.notifyError("Slot Date should not be older than today");
            return;
        }
        this.fetchslots();
    }

    render() {
        const {serviceId, serviceName, slots, slotDate} = this.state;
        const today = new Date().toISOString().substring(0, 10);
        return (
            <div>
                <div className="row"><div className="col-12"><br/></div></div>
                <div className="row">
                <div className="col-1"></div>    
                <label htmlFor="date-picker"><strong>Choose a Date for {serviceName}</strong></label>
                <div className="col-5">
                    <input  className="form-control form-control-lg"
                            id="date-picker"
                            type="date"
                            value={slotDate}
                            min={today}
                            onChange={(e)=>this.setDate(e.target.value)}/>
                </div>
                    <div className="col-3">
                        <button type="submit" disabled={!slotDate} className="btn btn-primary" onClick={(evt) => this.showSlotsOnDate()} >
                            Show Slots
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                    {slots.length > 0 ? <p><strong>Available Slots on {slotDate}</strong></p> : <br/>}
                    </div>
                </div>
                <CardColumns>
                    {slots.map((info, index) =>
                        <SlotInfo key={index} info={info} serviceId={serviceId} serviceName={serviceName}/>
                    )}
                </CardColumns>
            </div>
            );
    };

}

export default ChooseSlot;

