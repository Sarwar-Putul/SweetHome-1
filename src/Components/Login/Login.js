import React, {isValidElement, useContext, useRef, useState} from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { Button, Card, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import { Link, useHistory, useLocation } from 'react-router-dom';
import FacebookIcon from '@material-ui/icons/Facebook';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { UserContext } from '../../App';

import './Login.css'






    if(firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    } 



const Login = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext)
  const  history = useHistory();
  const  location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        newUser : false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error:''
    });
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const handleGoogleSignIn = () => {
            firebase.auth().signInWithPopup(googleProvider)
            .then(res => {
            const {displayName, email, photoURL}= res.user;
            const signedInUser = {
                isSignIn: true,
                name: displayName,
                email: email,
                photo: photoURL
              }
                setUser(signedInUser);
                setLoggedInUser(signedInUser)
                history.replace(from)
            })
            .catch((error) => {
                console.log(error);
                console.logo(error.message);
            });
    }

    const handleSignOut = () => {
        firebase.auth().signOut()
        .then(() => {
          const signOutUser = {
            isSignedIn: false,
              name: '',
              email: '',
              photo:''
          }
          setUser(signOutUser)
        })
        .catch(error => {
            console.log(error)
        });
      }

      const fbProvider = new firebase.auth.FacebookAuthProvider();
      const handleFbSignIn = () =>{
        firebase.auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        var credential = result.credential;
        var user = result.user;
        setUser(user);
    
        var accessToken = credential.accessToken;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
      }


      const handleBlur = (e) => {
            let isFormValid = true;
            if(e.target.value === 'email'){
               isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
            }
            if(e.target.value ==='password'){
                const isPasswordValid = e.target.value.length >6;
                const passwordHasNumber = /\d{1}/.test(e.target.value);
                isFormValid = isPasswordValid && passwordHasNumber;
            }
            if(isFormValid){
                const newUserInfo = {...user};
                newUserInfo[e.target.name]= e.target.value;
                setUser(newUserInfo);
            }
      }


      const handleSubmit = (e)=> {
        if(newUser && user.email && user.password){
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
              const newUserInfo = {...user};
  
              newUserInfo.success = true;
              setUser(newUserInfo);
              updateUserName(user.name);
              firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
              const newUserInfo = {...user};
              newUserInfo.error = '';
              newUserInfo.success = true;
              setUser(newUserInfo);
              console.log('user login', res.user);
              history.replace(from)
            })
            .catch((error) => {
              const newUserInfo = {...user};
              newUserInfo.error = error.message;
              newUserInfo.success = false;
              setUser(newUserInfo);
        });
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
      
        if(!newUser && user.email && user.password){
          firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('user details updated', res.user);
          history.replace(from)
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
        }
            e.preventDefault();
          }
          
      }


      const updateUserName = name => {
        const user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: name
        }).then(function() {
          console.log("User name updated successfully")
        }).catch(function(error) {
          console.log(error);
        });
}


    const userNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    
    return (
        <container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
            <div className = "w-100" style={{maxWidth:"400px"}}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Sign Up</h2>
                            <Form onSubmit={handleSubmit}>
                                {newUser && <Form.Group id="name">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="text" name="name"  onBlur={handleBlur} ref={userNameRef} placeholder="Type your name" required />
                                </Form.Group>}
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" onBlur={handleBlur} ref={emailRef} placeholder="Type your email" required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="Password" name="password" onBlur={handleBlur} ref={passwordRef} placeholder="Enter your password" required />
                                </Form.Group>
                                {newUser && <Form.Group id="password_confirm">
                                    <Form.Label>Password Confirm </Form.Label>
                                    <Form.Control type="password" name="password" onBlur={handleBlur} ref={passwordConfirmRef}  placeholder="Confirm your password" required />
                                </Form.Group>}
                                <Button className="w-100" type="submit">Sign in</Button> 
                            </Form>
                        </Card.Body>

                        <div className="w-100 text-center mt-2">
                           <h6>Are you a new user? <Link onClick={()=> setNewUser(!newUser)}>Sign up</Link><i class="fab fa-google"></i></h6>
                       </div>
                    <div className = "social-icons">
                        <div>
                              <h6 className="border-bottom ml-4 mr-4">Or</h6>
                      
                        {
                             user.isSignedIn ? <GTranslateIcon onClick ={handleSignOut}> Sign out </GTranslateIcon> : <GTranslateIcon onClick ={handleGoogleSignIn}></GTranslateIcon>
                        }
                        </div>
                        <br/>
                            <FacebookIcon className="w-100" variant="contained" color="primary" onClick ={handleFbSignIn}></FacebookIcon>
                    </div>
                    </Card>
                    

            </div>
        </container>
    );
};

export default Login;