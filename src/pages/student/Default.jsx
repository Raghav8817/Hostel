import React, { useState } from 'react';
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

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewStatus, setReviewStatus] = useState("");

    const submitReview = async () => {
        if (rating === 0) {
            setReviewStatus("Please select a rating.");
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/food-review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, review_text: reviewText }),
                credentials: "include"
            });
            if (res.ok) {
                setReviewStatus("Review submitted successfully!");
                setRating(0);
                setReviewText("");
            } else {
                setReviewStatus("Failed to submit review.");
            }
        } catch (err) {
            setReviewStatus("An error occurred.");
        }
    };

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

            {/* FOOD REVIEW COMPONENT */}
            <div className="stat" style={{ marginTop: '30px', textAlign: 'left', padding: '20px', maxWidth: '500px' }}>
                <h3>Today's Food Review</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Rate the food served today in the mess.</p>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span 
                            key={star} 
                            onClick={() => setRating(star)} 
                            style={{ fontSize: '30px', cursor: 'pointer', color: star <= rating ? '#f59e0b' : 'var(--border-color)', transition: 'color 0.2s' }}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea 
                    placeholder="Optional: What did you like or dislike?" 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginBottom: '15px' }}
                />

                <button onClick={submitReview} className="btn" style={{ background: '#00c6ff', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Submit Review
                </button>

                {reviewStatus && <p style={{ marginTop: '10px', color: reviewStatus.includes('successfully') ? '#22c55e' : '#ef4444' }}>{reviewStatus}</p>}
            </div>
        </>
    );
};

export default Default;