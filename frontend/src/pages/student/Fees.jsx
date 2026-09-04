import React, { useState } from 'react';
import '../../styles/Fees.css';

const Fees = () => {
    const [feeData, setFeeData] = useState([
        { id: 1, month: "January", amount: 10000, status: "Paid", date: "2024-01-05" },
        { id: 2, month: "February", amount: 10000, status: "Pending", date: "-" },
        { id: 3, month: "March", amount: 10000, status: "Pending", date: "-" }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFeeId, setSelectedFeeId] = useState(null);

    // Calculations
    const totalFees = feeData.reduce((acc, curr) => acc + curr.amount, 0);
    const paidAmount = feeData
        .filter(f => f.status === "Paid")
        .reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = totalFees - paidAmount;

    const handlePayClick = (id) => {
        setSelectedFeeId(id);
        setIsModalOpen(true);
    };

    const completePayment = (method) => {
        // Simulate payment processing
        setFeeData(feeData.map(f =>
            f.id === selectedFeeId
                ? { ...f, status: "Paid", date: new Date().toISOString().split('T')[0] }
                : f
        ));
        setIsModalOpen(false);
        alert(`Payment successful via ${method}! ✅`);
    };

    return (
        <div className="fees-container">
            {/* STAT CARDS */}
            <div className="fees-stats">
                <div className="f-card total">
                    <span>Total Structure</span>
                    <h2>₹{totalFees.toLocaleString()}</h2>
                </div>
                <div className="f-card paid">
                    <span>Amount Paid</span>
                    <h2>₹{paidAmount.toLocaleString()}</h2>
                </div>
                <div className="f-card pending">
                    <span>Balance Due</span>
                    <h2>₹{pendingAmount.toLocaleString()}</h2>
                </div>
            </div>

            {/* PAYMENT TABLE */}
            <div className="fees-table-box">
                <div className="table-header">
                    <h3>Payment History & Schedule</h3>
                    <button className="download-btn">
                        <i className="fas fa-file-download"></i> Download Statement
                    </button>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Amount</th>
                                <th>Date Paid</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeData.map((fee) => (
                                <tr key={fee.id}>
                                    <td>{fee.month}</td>
                                    <td>₹{fee.amount.toLocaleString()}</td>
                                    <td>{fee.date}</td>
                                    <td>
                                        <span className={`status-badge ${fee.status.toLowerCase()}`}>
                                            {fee.status}
                                        </span>
                                    </td>
                                    <td>
                                        {fee.status === "Pending" ? (
                                            <button className="pay-now-btn" onClick={() => handlePayClick(fee.id)}>
                                                Pay Online
                                            </button>
                                        ) : (
                                            <span className="receipt-link">View Receipt</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Secure Checkout</h3>
                        <p>Select your preferred payment method</p>

                        <div className="payment-options">
                            <div className="pay-option" onClick={() => completePayment('Card')}>
                                <i className="fas fa-credit-card"></i>
                                <span>Credit / Debit Card</span>
                            </div>
                            <div className="pay-option" onClick={() => completePayment('UPI')}>
                                <i className="fas fa-mobile-alt"></i>
                                <span>UPI (GPay / PhonePe)</span>
                            </div>
                            <div className="pay-option" onClick={() => completePayment('Net Banking')}>
                                <i className="fas fa-university"></i>
                                <span>Net Banking</span>
                            </div>
                        </div>

                        <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                            Cancel Transaction
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fees;