import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import ServiceInfo from './ServiceInfo';
import { notificationService } from '../services/NotificationService';
import { progressService } from '../services/ProgressService';

class ChooseService extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            services: [],
            progress: 0
        };
    }

    async componentDidMount() {
        const interval = setInterval(() => {
            let currentProgress = this.state.progress;
            currentProgress = currentProgress < 90 ? currentProgress + 1: currentProgress;
            this.setState({ progress: currentProgress });
            progressService.setCurrentProgress(this.state.progress);
        }, 50);
        try {
            let response = await fetch('http://localhost:8080/api/services/retrieveAvailableSalonServices');
            let services = await response.json();
            clearInterval(interval);
            this.setState({ progress: 100 });
            progressService.setCurrentProgress(this.state.progress);
            this.setState({ services: services });
        } catch(err) {
            this.setState({ progress: 100 });
            notificationService.notifyError("Something went wrong! : " + err);
        }
        setTimeout(() => {
            progressService.clearProgress();
        }, 1000);
    }

    render() {
        const { services } = this.state;
        return (
            <CardColumns>
                {services.map((info, index) =>
                    <ServiceInfo key={index} info={info}/>
                )}
            </CardColumns>
        );
    }
}

export default ChooseService;