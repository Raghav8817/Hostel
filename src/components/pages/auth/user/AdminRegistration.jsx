import { useState } from "react";
import "../../../../styles/AdminRegistration.css";
import RegisteredSuccess from "./RegisteredSuccess";
import {Routes,Route} from 'react-router-dom';
function AdminRegistration() {
    const [formData, setFormData] = useState({
        username: "",
        middlename:"",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
        confirmpassword:"",
    });
    const [submitted,setSubmitted]=useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // console.log(e.target)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData); 
        if (formData.confirmpassword!=formData.password) {
            window.alert("password doesn't match with confirm password");
        }
        else if (formData.phone.length!=10) {
            window.alert("provide valid phone");
        }
        else{
            try {
                const response = await fetch("http://localhost:3000/register", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
                setSubmitted(true);
                console.log("passed")
            } catch (error) {
                console.log("error sending data to backend")
            }
        }
    };
    if (submitted) {
        return <RegisteredSuccess/>;
    }
    return (
        <div>
            <div className="bg-overlay"></div>
            <div className="register-container">
                <div className="form-box">
                    <h2>Admin Registration</h2>

                    <form action="#" onSubmit={handleSubmit}>
                        <div className="form-grid">

                            <div className="input-group">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username"  name="username" onChange={handleChange} required/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="First Name" name="firstname" required onChange={handleChange} />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Middle Name" name="middlename" onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Last Name" name="lastname" required  onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-venus-mars"></i>
                                <select name="gender" defaultValue="" onChange={handleChange}>
                                    <option value="" disabled>
                                        Select Gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input type="email" placeholder="Email Address" name="email" required  onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-phone"></i>
                                <input type="number" placeholder="Phone Number" name="phone" required  onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" name="password"required onChange={handleChange} />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Confirm Password" name="confirmpassword" required  onChange={handleChange}/>
                            </div>

                        </div>

                        <button type="submit" className="register-btn">
                            Register Admin
                        </button>

                        <p className="switch">
                            Already registered? <a href="/adminlog">Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminRegistration;