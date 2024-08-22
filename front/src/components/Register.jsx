import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../styles/mix.css"
import { NavLink, useParams } from "react-router-dom"
import { baseURL } from "../constants";
import axios from "axios";

const Register = () => {

  const [inputdata,setInputdata] = useState({
    email:"",
  });

  const { affiliateLink } = useParams();

  // setinputvalue
  const handleChange = (e)=>{
    const {name,value} = e.target;
    setInputdata({...inputdata,[name]:value})
  }


  // register data
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const {email} = inputdata;

    if(email === ""){
      toast.error("Please input your Email")
    }else if(!email.includes("@")){
      toast.error("Invalid Email")
    }else{
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      await axios.post(
        `${baseURL}/api/users/register`,
        { email, affiliateLink },
        config
      ).then((res) => {
        console.log('response----', res)
        toast.success(res.data.message);
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
            <h1>Sign Up</h1>
            <p style={{textAlign:"center"}}>We are glad that you will be using Project Cloud to manage
              your tasks! We hope that you will get like it.</p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id=""  onChange={handleChange}  placeholder='Enter Your Email Address' />
            </div>
            <button className='btn' onClick={handleSubmit} style={{width:'430px',backgroundColor:'green',height:'50px',borderRadius:'20px',color:'white',fontSize:'20px',fontFamily:'cursive'}}>Sign Up</button>
            <p style={{width:'430px',backgroundColor:'green',height:'50px',borderRadius:'20px',color:'white',fontSize:'20px'}}> <NavLink to="/" style={{color:'white',fontFamily:'cursive'}}>Login</NavLink> </p>
          </form>
        </div>
        <ToastContainer autoClose={3000} draggableDirection="x"/>
      </section>
    </>
  )
}

export default Register