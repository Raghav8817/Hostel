import React, { useEffect, useState } from "react";
import "../../styles/admin/AdminFees.css";

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    status: ""
  });

  /* LOAD FROM LOCAL STORAGE */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("fees")) || [
      { name: "Rahul", amount: 5000, status: "Paid" },
      { name: "Aman", amount: 4500, status: "Pending" },
      { name: "Priya", amount: 6000, status: "Paid" },
      { name: "Neha", amount: 5500, status: "Pending" },
      { name: "Rohit", amount: 5000, status: "Paid" }
    ];
    setFees(data);
  }, []);

  /* SAVE TO LOCAL STORAGE */
  const updateStorage = (data) => {
    setFees(data);
    localStorage.setItem("fees", JSON.stringify(data));
  };

  /* ADD FEES */
  const save = () => {
    if (!form.name || !form.amount || !form.status) {
      alert("Please fill all fields");
      return;
    }

    const newData = [...fees, form];
    updateStorage(newData);

    setForm({ name: "", amount: "", status: "" });
    setModal(false);
  };

  /* PAY */
  const markPaid = (index) => {
    const updated = [...fees];
    updated[index].status = "Paid";
    updateStorage(updated);
  };

  /* DELETE */
  const deleteFee = (index) => {
    const updated = fees.filter((_, i) => i !== index);
    updateStorage(updated);
  };

  /* FILTER DATA */
  const filtered = fees.filter(f => {
    let text = (f.name + f.status).toLowerCase();
    if (!text.includes(search.toLowerCase())) return false;
    if (filter !== "all" && f.status.toLowerCase() !== filter) return false;
    return true;
  });

  /* STATS */
  const paid = fees.filter(f => f.status === "Paid").length;
  const pending = fees.filter(f => f.status === "Pending").length;

  return (
    <div className="fees-container">
      <h2>Fees Management</h2>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <span>Total Records</span>
          <h2>{fees.length}</h2>
        </div>
        <div className="card">
          <span>Total Paid</span>
          <h2 style={{ color: "#22c55e" }}>{paid}</h2>
        </div>
        <div className="card">
          <span>Total Pending</span>
          <h2 style={{ color: "#ef4444" }}>{pending}</h2>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="top">
        <input
          type="text"
          placeholder="Search student..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

        <button className="btn" onClick={() => setModal(true)}>
          + Add New Record
        </button>
      </div>

      {/* TABLE */}
      <table className="fees-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((f, i) => (
            <tr key={i}>
              <td>{f.name}</td>
              <td>₹{f.amount}</td>
              <td>
                <span className={`status ${f.status.toLowerCase()}`}>
                  {f.status}
                </span>
              </td>
              <td className="action">
                {f.status === "Pending" && (
                  <button className="pay" title="Mark as Paid" onClick={() => markPaid(i)}>✔</button>
                )}
                <button className="delete" title="Delete Record" onClick={() => deleteFee(i)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {modal && (
        <div className="modal">
          <div className="modal-box">
            <span className="close" onClick={() => setModal(false)}>✖</span>
            <h3>Add Fees Record</h3>

            <input
              placeholder="Student Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">Select Status</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>

            <button className="btn" onClick={save}>Save Record</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFees;