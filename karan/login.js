window.onload=function(){
    login()
}
function login(){
    console.log("calkled");
    if (isProfileStored()) {
        console.log("Data found! Loading profile...");
        loadProfile(); // Run your function to fill the UI
    } else {
        login()
        // Optional: window.location.href = "signup.html";
    }
    const text=(`<div id="dashboardContainer">
    <div class="container">
        <!-- Dashboard Page -->
        <div id="dashboardPage">
            <div class="topbar">
                <h2>Expense Dashboard</h2>
                <div class="profile" onclick="toggleMenu()">
                    <img id="profileImg" src="https://i.pravatar.cc/40">
                    <div class="dropdown" id="dropdown">
                        <p onclick="openProfile()">👤 Profile</p>
                        <p onclick="logout()">🚪 Logout</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-card">
                <input id="title" placeholder="Title">
                <input id="amount" type="number" placeholder="Amount">
                <input id="date" type="date">
                <select id="type">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <button onclick="addTransaction()">Add Transaction</button>
            </div>

            <div class="dashboard-card">
                <h3>Summary</h3>
                <p>Balance: <span id="balance">0</span></p>
                <p>Income: <span id="income">0</span></p>
                <p>Expense: <span id="expense">0</span></p>
            </div>

            <div class="dashboard-card">
                <h3>Transactions</h3>
                <div id="data"></div>
            </div>
        </div>

        <!-- Profile Page -->
        <div id="profilePage" style="display:none;">
            <div class="dashboard-card">
                <h2>My Profile</h2>
                <div class="profile-img">
                    <img id="preview" src="https://i.pravatar.cc/80">
                </div>
                <input type="file" id="profileFile" accept="image/*" onchange="loadImage(event)">
                <input id="profName" placeholder="Name">
                <input id="profEmail" placeholder="Email">
                <input id="profPhone" placeholder="Phone">
                <button onclick="saveProfile()">Save Changes</button>
                <button onclick="goBack()">Back to Dashboard</button>
            </div>
        </div>
    </div>
</div>`)

document.body.innerHTML=text
}