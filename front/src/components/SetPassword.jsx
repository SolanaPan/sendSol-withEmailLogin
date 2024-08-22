import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../styles/mix.css"
import { useParams, useNavigate } from "react-router-dom"
import { baseURL } from "../constants";
import axios from "axios";

const SetPassword = () => {

  const [inputdata,setInputdata] = useState({
    password:"",
    password1: ""
  });

  const { token } = useParams();
  const navigate = useNavigate();

  console.log('token--', token)

  // setinputvalue
  const handleChange = (e)=>{
    const {name,value} = e.target;
    setInputdata({...inputdata,[name]:value})
  }


  // register data
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const {password, password1} = inputdata;

    if(password === ""){
      toast.error("Please input your password")
    }else if(password.length < 6){
      toast.error("Password should be at least 6 characters")
    }else if (password !== password1){
      toast.error("Passwords do not match")
    }
    else{
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      const info = {
        token,
        password
      }
      await axios.post(
        `${baseURL}/api/users/setpassword`,
        {info},
        config
      ).then((res) => {
        console.log('response----', res)
        toast.success(res.data.message);
        navigate('/')
      }).catch((err) => {
        console.log('Error---', err)
        toast.error(err.response.data.error);
      })
    }
  }


  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Please set your password</h1>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id=""  onChange={handleChange}  placeholder='Set Your Password' />
            </div>
            <div className="form_input">
              <label htmlFor="password1">Confirm Password</label>
              <input type="password" name="password1" id=""  onChange={handleChange}  placeholder='Confirm Password' />
            </div>
            <button className='btn' onClick={handleSubmit} style={{width:'430px',backgroundColor:'green',height:'50px',borderRadius:'20px',color:'white',fontSize:'20px',fontFamily:'cursive'}}>Set Password</button>
            {/* <p style={{width:'430px',backgroundColor:'green',height:'50px',borderRadius:'20px',color:'white',fontSize:'20px'}}> <NavLink to="/" style={{color:'white',fontFamily:'cursive'}}>Login</NavLink> </p> */}
          </form>
        </div>
        <ToastContainer autoClose={3000} draggableDirection="x"/>
      </section>
    </>
  )
}

export default SetPassword