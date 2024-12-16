import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import loader from '../assests/loader.gif'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { SetAvatarRoute } from '../utils/APIRoutes';
import {Buffer} from 'buffer'

function SetAvatar() {
  const api='https://api.multiavatar.com/45678945'
  const navigate=useNavigate()
  const [avatars,setAvatars] = useState([])
  const [isloading, setisLoading] = useState(true)
  const [selectedAvatar, setselectedAvatar] = useState(undefined)

  const toastoptions={
    position:'bottom-right',
    autoClose: 9000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"
  }

useEffect(()=>{
  if(!localStorage.getItem('chat-app-user')){
    navigate('/login')
  }
},[])

const setProfilePicture = async()=>{
  if(selectedAvatar === undefined){
    toast.error("Please select the avatar",toastoptions)
  }
  else{
    const user= await JSON.parse(localStorage.getItem("chat-app-user"))
    const {data} = await axios.post(`${SetAvatarRoute}/${user._id}`,{
      image:avatars[selectedAvatar]
    })
    if(data.isSet){
      user.isAvatarImageSet=true;
      user.avatarImage=data.image;
      localStorage.setItem("chat-app-user",JSON.stringify(user))
      navigate('/')
    }else{
      toast.error("Error setting avatar please try again later",toastoptions)
    }
  }
}
useEffect(()=>{
  const fetchData=async()=>{
    const data=[]
    for(let i=0;i<4;i++){
      const image = await axios.get(`${api}/${Math.round(Math.random()*1000)}`)
      const buffer=new Buffer(image.data)
      data.push(buffer.toString("base64"))
    }
    setAvatars(data)
    setisLoading(false)
  }
  fetchData()
  
},[])

  return (
    <>
    {
      isloading? <Container>
        <img src={loader} alt="loader" className="loader" />
      </Container> :(
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile</h1>
          </div>
          <div className="avatars" >
          {
            avatars.map((avatar,index)=>{
              return (
                <div key={index} className={`avatar ${selectedAvatar === index?"selected":""}`}>
                <img src= {`data:image/svg+xml;base64,${avatar} `} key={avatar} alt="avatar" onClick={()=>setselectedAvatar(index)} />
                </div>

              )
            })
          }
          </div>
          <button className='submit-btn' onClick={setProfilePicture}>Set Profile Picture</button>
          <ToastContainer />

        </Container>
      )}
      
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar