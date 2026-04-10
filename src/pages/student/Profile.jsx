import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

const Profile = () => {
    const user = useOutletContext();
    const navigate = useNavigate();

    const [roomStatusObj, setRoomStatusObj] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [applyStatus, setApplyStatus] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [acFilter, setAcFilter] = useState("All");

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    async function fetchRoomData() {
        try {
            const statusRes = await fetch(`${BASE_URL}/room-status`, { credentials: "include" });
            if (statusRes.ok) {
                const s = await statusRes.json();
                setRoomStatusObj(s);
            }
            const roomsRes = await fetch(`${BASE_URL}/rooms`);
            if (roomsRes.ok) {
                const r = await roomsRes.json();
                setAvailableRooms(r);
            }
        } catch {
            console.error("Failed to fetch room data");
        }
    }

    useEffect(() => {
        fetchRoomData();
    }, []);

    async function handleApplyRoom() {
        if (!selectedRoom) return setApplyStatus("Please select a room.");
        setApplyStatus("Applying...");
        try {
            const res = await fetch(`${BASE_URL}/apply-room`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ room_number: selectedRoom }),
                credentials: "include"
            });
            if (res.ok) {
                setApplyStatus("Application success! Refreshing...");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                const data = await res.json();
                setApplyStatus(data.error || "Failed to apply.");
            }
        } catch {
            setApplyStatus("An error occurred.");
        }
    };

    // Sorting & grouping helpers
    const getAcLabel = (room_type) => room_type && room_type.toLowerCase().includes("ac") ? "AC" : "Non-AC";
    const getBaseType = (room_type) => {
        if (!room_type) return "Other";
        const t = room_type.toLowerCase();
        if (t.includes("single")) return "Single";
        if (t.includes("double")) return "Double";
        if (t.includes("triple")) return "Triple";
        return room_type;
    };

    const filteredRooms = availableRooms.filter(r => {
        const ac = getAcLabel(r.room_type);
        const type = getBaseType(r.room_type);
        if (typeFilter !== "All" && type !== typeFilter) return false;
        if (acFilter !== "All" && ac !== acFilter) return false;
        return true;
    });

    // Group by AC → Type → rooms
    const grouped = filteredRooms.reduce((acc, r) => {
        const ac = getAcLabel(r.room_type);
        const type = getBaseType(r.room_type);
        const key = `${ac} — ${type} Sharing`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
    }, {});

    // Sort group keys: AC before Non-AC, then Single → Double → Triple
    const typeOrder = { Single: 1, Double: 2, Triple: 3 };
    const sortedGroupKeys = Object.keys(grouped).sort((a, b) => {
        const [acA, typeA] = a.split(" — ");
        const [acB, typeB] = b.split(" — ");
        if (acA !== acB) return acA === "AC" ? -1 : 1;
        return (typeOrder[typeA.replace(" Sharing", "")] || 9) - (typeOrder[typeB.replace(" Sharing", "")] || 9);
    });

    if (!user) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#00c6ff' }}>
                <h2>Loading User Data...</h2>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-layout-grid">

                {/* --- LEFT COLUMN --- */}
                <div className="profile-left-col">
                    <div className="profile-card">
                        <img
                            src={user.profile_pic || `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=00c6ff&color=fff`}
                            alt="Profile"
                            className="profile-avatar"
                        />
                        <div className="profile-info">
                            <h2 style={{ textAlign: "center" }}>{user.firstname} {user.lastname}</h2>
                            <p style={{ justifyContent: "center" }}><strong>Username:</strong> {user.username}</p>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: '15px' }}>
                                <button className="btn edit-btn" onClick={() => navigate('/edit')} style={{ marginTop: '0' }}>
                                    <i className="fas fa-edit"></i> Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="profile-right-col">
                    {/* COMBINED DETAILS CARD */}
                    <div className="single-details-card">
                        <div className="details-card-header">
                            <h3>Profile Details</h3>
                        </div>
                        <div className="details-inline-grid">
                            {user.bio && (
                                <div className="detail-box full-width">
                                    <h4>About Me</h4>
                                    <p>{user.bio}</p>
                                </div>
                            )}
                            <div className="detail-box">
                                <h4>Full Name</h4>
                                <p>{user.firstname} {user.lastname}</p>
                            </div>
                            <div className="detail-box">
                                <h4>Email</h4>
                                <p>{user.email || `${user.username}@college.edu`}</p>
                            </div>
                            <div className="detail-box">
                                <h4>Phone</h4>
                                <p>{user.phone || 'Not Provided'}</p>
                            </div>
                            <div className="detail-box">
                                <h4>Course</h4>
                                <p>{user.course ? user.course : "N/A"}</p>
                            </div>
                        </div>

                        {/* ROOM APPLICATION SECTION */}
                        <div className="bio-section" style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
                            <h3><i className="fas fa-door-open" style={{ marginRight: '8px', color: '#00c6ff' }}></i>Hostel Room</h3>

                            {/* ASSIGNED */}
                            {roomStatusObj?.status === "Assigned" && (
                                <div style={{ marginTop: '15px', padding: '15px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' }}>
                                    <h4 style={{ color: '#22c55e', margin: 0 }}>✓ Room Assigned</h4>
                                    <p style={{ marginTop: '6px', color: 'var(--text-primary)' }}>
                                        You are currently residing in Room <strong style={{ color: '#22c55e' }}>{roomStatusObj.room}</strong>.
                                    </p>
                                </div>
                            )}

                            {/* PENDING */}
                            {roomStatusObj?.status === "Pending" && (
                                <div style={{ marginTop: '15px', padding: '15px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' }}>
                                    <h4 style={{ color: '#f59e0b', margin: 0 }}>⏳ Application Pending</h4>
                                    <p style={{ marginTop: '6px', color: 'var(--text-primary)' }}>
                                        Your request for Room <strong style={{ color: '#f59e0b' }}>{roomStatusObj.room}</strong> is awaiting admin approval.
                                    </p>
                                </div>
                            )}

                            {/* APPLY FORM */}
                            {roomStatusObj?.status === "None" && (
                                <div style={{ marginTop: '15px' }}>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                        You haven't been assigned a room yet. Use the filters below to find and apply for a room.
                                    </p>

                                    {/* FILTERS */}
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '140px' }}>
                                            <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sharing Type</label>
                                            <select
                                                value={typeFilter}
                                                onChange={e => { setTypeFilter(e.target.value); setSelectedRoom(""); }}
                                                style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                                            >
                                                <option value="All">All Types</option>
                                                <option value="Single">Single</option>
                                                <option value="Double">Double</option>
                                                <option value="Triple">Triple</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '140px' }}>
                                            <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AC / Non-AC</label>
                                            <select
                                                value={acFilter}
                                                onChange={e => { setAcFilter(e.target.value); setSelectedRoom(""); }}
                                                style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                                            >
                                                <option value="All">All</option>
                                                <option value="AC">AC</option>
                                                <option value="Non-AC">Non-AC</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* GROUPED ROOM LIST */}
                                    {sortedGroupKeys.length === 0 ? (
                                        <p style={{ color: '#ef4444' }}>No available rooms match your filters.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                                            {sortedGroupKeys.map(groupKey => (
                                                <div key={groupKey}>
                                                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#00c6ff', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                                                        {groupKey}
                                                    </p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {grouped[groupKey].map(r => {
                                                            const spotsLeft = r.capacity - r.current_occupancy;
                                                            const isSelected = selectedRoom === r.room_number;
                                                            return (
                                                                <button
                                                                    key={r.room_number}
                                                                    onClick={() => setSelectedRoom(r.room_number)}
                                                                    style={{
                                                                        padding: '8px 14px',
                                                                        borderRadius: '8px',
                                                                        border: isSelected ? '2px solid #00c6ff' : '1px solid var(--border-color)',
                                                                        background: isSelected ? 'rgba(0,198,255,0.15)' : 'rgba(255,255,255,0.04)',
                                                                        color: isSelected ? '#00c6ff' : 'var(--text-primary)',
                                                                        cursor: 'pointer',
                                                                        fontSize: '13px',
                                                                        fontWeight: isSelected ? 700 : 400,
                                                                        transition: 'all 0.2s',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    Room {r.room_number}
                                                                    <span style={{ marginLeft: '6px', fontSize: '11px', color: isSelected ? '#00c6ff' : '#aaa' }}>
                                                                        ({spotsLeft} spot{spotsLeft !== 1 ? 's' : ''})
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* APPLY BUTTON */}
                                    {selectedRoom && (
                                        <div style={{ marginTop: '18px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(0,198,255,0.08)', border: '1px solid rgba(0,198,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                            <span style={{ color: 'var(--text-primary)' }}>Selected: <strong style={{ color: '#00c6ff' }}>Room {selectedRoom}</strong></span>
                                            <button
                                                onClick={handleApplyRoom}
                                                style={{ background: 'linear-gradient(135deg, #00c6ff, #43e97b)', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
                                            >
                                                Submit Application
                                            </button>
                                        </div>
                                    )}

                                    {applyStatus && (
                                        <p style={{ marginTop: '12px', color: applyStatus.includes('success') ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                                            {applyStatus}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;