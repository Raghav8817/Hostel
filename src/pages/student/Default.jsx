import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../../styles/Default.css';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Default = () => {
    const userData = useOutletContext();
    const name = userData?.firstname || "User";

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewStatus, setReviewStatus] = useState("");

    const [monthlyData, setMonthlyData] = useState(null);
    const [monthlyLoading, setMonthlyLoading] = useState(true);
    const [hasReviewedToday, setHasReviewedToday] = useState(false);
    const [todayMenu, setTodayMenu] = useState(null);

    const fetchDashboardData = async () => {
        setMonthlyLoading(true);
        try {
            // Fetch monthly reviews
            const reviewRes = await fetch(`${BASE_URL}/food-review/monthly`, { credentials: 'include' });
            if (reviewRes.ok) {
                const data = await reviewRes.json();
                setMonthlyData(data);
                setHasReviewedToday(data.userHasReviewedToday);
            }

            // Fetch today's menu
            const menuRes = await fetch(`${BASE_URL}/mess-menu/today`, { credentials: 'include' });
            if (menuRes.ok) {
                const data = await menuRes.json();
                setTodayMenu(data);
            }
        } catch {
            console.error("Failed to load dashboard data");
        } finally {
            setMonthlyLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const submitReview = async () => {
        if (rating === 0) { setReviewStatus("Please select a rating."); return; }
        try {
            const res = await fetch(`${BASE_URL}/food-review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, review_text: reviewText }),
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                setReviewStatus("Review submitted successfully!");
                setRating(0);
                setReviewText("");
                fetchDashboardData(); // refresh monthly card
            } else {
                setReviewStatus(data.error || "Failed to submit review.");
            }
        } catch {
            setReviewStatus("An error occurred.");
        }
    };

    const summary = monthlyData?.summary;
    const daily = monthlyData?.daily || [];
    const totalReviews = summary?.total_reviews || 0;
    const monthlyAvg = summary?.monthly_avg || 0;
    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const todayName = todayMenu?.day || new Date().toLocaleString('default', { weekday: 'long' }).toUpperCase();

    const starBreakdown = [
        { label: '5★', count: summary?.five_star || 0, color: '#22c55e' },
        { label: '4★', count: summary?.four_star || 0, color: '#84cc16' },
        { label: '3★', count: summary?.three_star || 0, color: '#f59e0b' },
        { label: '2★', count: summary?.two_star || 0, color: '#f97316' },
        { label: '1★', count: summary?.one_star || 0, color: '#ef4444' },
    ];

    const maxDailyAvg = Math.max(...daily.map(d => d.avg_rating), 1);

    return (
        <div className="dashboard-container">
            {/* DYNAMIC MESS MENU HEADER */}
            <div className="stat menu-header-card">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(147, 200, 62, 0.3)', paddingBottom: '15px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ color: '#93c83e', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>Mess Schedule</span>
                            <h1 style={{ margin: 0, fontSize: '2rem', color: '#fff', fontWeight: '800' }}>Today's Menu: <span style={{ color: '#93c83e' }}>{todayName}</span></h1>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                        {[
                            { label: 'Breakfast', icon: 'fa-egg', color: '#f59e0b', meal: todayMenu?.breakfast },
                            { label: 'Lunch', icon: 'fa-utensils', color: '#22c55e', meal: todayMenu?.lunch },
                            { label: 'Evening Snacks', icon: 'fa-cookie-bite', color: '#84cc16', meal: todayMenu?.evening_snacks },
                            { label: 'Dinner', icon: 'fa-moon', color: '#0ea5e9', meal: todayMenu?.dinner },
                        ].map((m, idx) => (
                            <div key={idx} className="meal-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <i className={`fas ${m.icon}`} style={{ color: m.color, fontSize: '1.2rem' }}></i>
                                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>{m.label}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>
                                    {m.meal || 'Loading...'}
                                </p>
                            </div>
                        ))}
                    </div>

                    {todayMenu?.milk && (
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(147, 200, 62, 0.15)', padding: '12px 20px', borderRadius: '10px', width: 'fit-content', border: '1px solid rgba(147, 200, 62, 0.3)' }}>
                            <i className="fas fa-glass-whiskey" style={{ color: '#93c83e', fontSize: '1.2rem' }}></i>
                            <span style={{ fontSize: '0.95rem', color: '#fff' }}><strong>Night Supplement:</strong> {todayMenu.milk} (Milk)</span>
                        </div>
                    )}
                </div>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(147, 200, 62, 0.05)', borderRadius: '50%', zIndex: 0 }}></div>
            </div>

            {/* FOOD REVIEW SECTION - Two cards side by side */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start', width: '100%' }}>

                {/* SUBMIT REVIEW CARD */}
                <div className="stat" style={{ flex: '1', minWidth: '280px', maxWidth: '460px', textAlign: 'left', padding: '24px', opacity: hasReviewedToday ? 0.7 : 1 }}>
                    <h3 style={{ marginBottom: '6px' }}>🍽️ Today's Food Review</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', fontSize: '14px' }}>
                        {hasReviewedToday ? "You have already submitted your review for today. Thank you!" : "Rate the food served today in the mess."}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', pointerEvents: hasReviewedToday ? 'none' : 'auto' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                style={{ fontSize: '32px', cursor: 'pointer', color: star <= rating ? '#f59e0b' : 'var(--border-color)', transition: 'color 0.2s, transform 0.1s', display: 'inline-block', transform: star <= rating ? 'scale(1.15)' : 'scale(1)' }}
                            >★</span>
                        ))}
                    </div>
                    <textarea
                        placeholder={hasReviewedToday ? "Feedback submitted." : "Optional: What did you like or dislike?"}
                        value={reviewText}
                        disabled={hasReviewedToday}
                        onChange={(e) => setReviewText(e.target.value)}
                        style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginBottom: '15px', boxSizing: 'border-box', resize: 'vertical', filter: hasReviewedToday ? 'grayscale(1)' : 'none' }}
                    />
                    <button 
                        onClick={submitReview} 
                        disabled={hasReviewedToday}
                        style={{ 
                            background: hasReviewedToday ? '#334155' : 'linear-gradient(135deg, #062319, #0a3d2b)', 
                            color: hasReviewedToday ? '#94a3b8' : '#93c83e', 
                            padding: '10px 24px', 
                            border: `1px solid ${hasReviewedToday ? '#475569' : '#93c83e'}`, 
                            borderRadius: '8px', 
                            cursor: hasReviewedToday ? 'not-allowed' : 'pointer', 
                            fontWeight: 700, 
                            fontSize: '14px', 
                            transition: 'all 0.2s' 
                        }}
                        onMouseEnter={e => { if(!hasReviewedToday) { e.target.style.background = '#93c83e'; e.target.style.color = '#062319'; } }}
                        onMouseLeave={e => { if(!hasReviewedToday) { e.target.style.background = 'linear-gradient(135deg, #062319, #0a3d2b)'; e.target.style.color = '#93c83e'; } }}
                    >
                        {hasReviewedToday ? "Reviewed for Today" : "Submit Review"}
                    </button>
                    {reviewStatus && <p style={{ marginTop: '10px', fontSize: '13px', color: reviewStatus.includes('successfully') ? '#22c55e' : '#ef4444' }}>{reviewStatus}</p>}
                </div>

                {/* MONTHLY REVIEW CARD */}
                <div className="stat" style={{ flex: '1', minWidth: '280px', textAlign: 'left', padding: '24px' }}>
                    <h3 style={{ marginBottom: '4px' }}>📊 Monthly Food Ratings</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>{monthName} — All Students Average</p>

                    {monthlyLoading ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
                    ) : totalReviews === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No reviews this month yet.</p>
                    ) : (
                        <>
                            {/* Big average score */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <div style={{ fontSize: '48px', fontWeight: 800, color: monthlyAvg >= 4 ? '#22c55e' : monthlyAvg >= 3 ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>
                                    {monthlyAvg}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', gap: '3px' }}>
                                        {[1,2,3,4,5].map(s => (
                                            <span key={s} style={{ fontSize: '18px', color: s <= Math.round(monthlyAvg) ? '#f59e0b' : 'var(--border-color)' }}>★</span>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{totalReviews} review{totalReviews !== 1 ? 's' : ''} this month</p>
                                </div>
                            </div>

                            {/* Star breakdown bars */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                {starBreakdown.map(({ label, count, color }) => {
                                    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                                    return (
                                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 600, width: '24px', color }}>{label}</span>
                                            <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'var(--border-color)', overflow: 'hidden' }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                                            </div>
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '28px', textAlign: 'right' }}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Daily trend bars */}
                            {daily.length > 1 && (
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Trend</p>
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '50px' }}>
                                        {daily.map((d) => {
                                            const h = Math.max(6, (d.avg_rating / maxDailyAvg) * 50);
                                            const col = d.avg_rating >= 4 ? '#22c55e' : d.avg_rating >= 3 ? '#f59e0b' : '#ef4444';
                                            const day = new Date(d.review_date).getDate();
                                            return (
                                                <div key={d.review_date} title={`${day}: avg ${d.avg_rating} (${d.total_reviews} reviews)`}
                                                    style={{ flex: 1, height: `${h}px`, background: col, borderRadius: '3px 3px 0 0', cursor: 'default', transition: 'opacity 0.2s', opacity: 0.85 }}
                                                    onMouseEnter={e => e.target.style.opacity = 1}
                                                    onMouseLeave={e => e.target.style.opacity = 0.85}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>1st</span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{monthName}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Default;