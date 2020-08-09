import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { progressService } from '../services/ProgressService';

class LoadingIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProgress: {now: 0},
            showProgress: true
        };
    }

    componentDidMount() {
        this.subscription = progressService.getProgress().subscribe(progress => {
            if (progress) {
                this.setState({ currentProgress: progress });
            } else {
                this.setState({ showProgress: false });
            }
        });
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    render() {
        const { currentProgress, showProgress } = this.state;
        if (showProgress) {
            return (
                <div>
                <ProgressBar now={currentProgress.now} label={`${currentProgress.now}%`} /> 
                </div>
                );
        } else {
            return (<div/>);
        }
    }
}

export {LoadingIndicator};