import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import {ROUTES} from "../routes/AppRouter.tsx";

const NotFoundPage: React.FC = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary">
                    <Link to={ROUTES.HOME}>Back Home</Link>
                </Button>
            }
        />
    );
};

export default NotFoundPage;
