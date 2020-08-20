import React from 'react';
import Alert from 'react-bootstrap/Alert'
import { notificationService } from '../services/NotificationService';

class AppNotificationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: []
        };
    }

    componentDidMount() {
        this.subscription = notificationService.getNotifier().subscribe(notification => {
            if (notification) {
                this.setState({ notifications: [notification] });
            } else {
                this.setState({ notifications: [] });
            }
        });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        const { notifications } = this.state;
        const onClose = () => this.setState({ notifications: [] });
        return (
                <div>
                    {notifications.map((notification, index) =>
                        <Alert  key={index} variant={notification.variant} onClose={onClose} dismissible>
                            {notification.message}
                        </Alert >
                    )}
                </div>
        );
    }
}

export default AppNotificationComponent;