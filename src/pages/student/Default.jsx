import React from 'react';
import { useOutletContext } from 'react-router-dom'; // 1. Import the hook
import '../../styles/Default.css';

const Default = () => {
    // 2. Grab the data from the Layout's <Outlet context={userData} />
    const userData = useOutletContext();

    // 3. Destructure the values with fallback 0 to prevent the .toLocaleString() error
    const name=userData?.firstname||"User";
    const attendance = userData?.attendance || 0;
    const feesPaid = userData?.feesPaid || 0;
    const pending = userData?.pendingFees || 0;

    return (
        <>
            <div>
                <h1>Welcome to Dashboard {name}</h1>
            </div>
            <div className="stats">
                <div className="stat">
                    <span>Attendance</span>
                    <h2>{attendance}%</h2>
                </div>

                <div className="stat">
                    <span>Fees Paid</span>
                    <h2>₹{feesPaid.toLocaleString('en-IN')}</h2>
                </div>

                <div className="stat">
                    <span>Pending</span>
                    <h2>₹{pending.toLocaleString('en-IN')}</h2>
                </div>
            </div>
        </>
    );
};

export default Default;