import React from 'react';
import GoogleLogin from 'react-google-login'
import './login.css'
import Style from 'style-it';
import {serverEndpoint} from '../config'

const Login=(props)=>{

    //Redirect to server for git oauth
    const gitAuth=(e)=>{
        console.log("Getting Access Token from git....");
        window.open(`${serverEndpoint}/oauth/git`,'_self');
      }
    
    //Send information to server to login session
    let googleAuth=async(response)=>{
        if(response.error===undefined || response.error===null){
          let {profileObj}=response
          let user={login:profileObj.name,
                    imageUrl:profileObj.imageUrl,
                   }
          let resp=await fetch(`${serverEndpoint}/oauth/google`,{
            method:"post",
            credentials:"include",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({user:user,access_token:response.accessToken})
          })
          resp=await resp.json()
          console.log(resp);
          if(resp.message==="Success")    //If login success redirect to main page
            window.open(`/`,'_self')
        
        }
    }
    
    return Style.it(`
        .login-main-outer{
            background-color: ${props.theme[0]};
        }
        .login-main-component{
            background-color: ${props.theme[1]};
        }
        .login-main-auth{
            background-color: ${props.theme[4]};
        }
        .login-footer{
            background-color: ${props.theme[1]};
        }
        .col{
            color:${props.theme[3]};
        }
        #google-icon{
            filter:${props.theme[5]};
        }
        #git-icon{
            filter:${props.theme[5]};
        }
        
    `,  
    <div className='login-component'>
        <div className="login-main-outer" >
          <div className="login-main-component">
              <h1 className="col">Meet2Code</h1>
              <h3 className="col">Meet togther for <span style={{color:props.theme[4]}}>colloborative coding</span> and <span style={{color:props.theme[4]}}>document editing.</span></h3>
              <div className="login-main-auth" onClick={(e)=>{gitAuth()}}>
                <div className="col">
                    <img id='git-icon' src='/icons/github.png' alt="img"></img>
                </div>
                <div className="col"><span className="">Log in with Github</span></div>
                
              </div>
                <GoogleLogin 
                    clientId="363691655533-93fci0que3b37rmbolgpf4e0tejcer97.apps.googleusercontent.com"
                    onSuccess={googleAuth}
                    onFailure={googleAuth}
                    render={renderProps =>{ 
                      return (
                      <div className="login-main-auth" onClick={renderProps.onClick}>
                        <div className="col">
                            <img id='google-icon' src='/icons/google.png' alt="img"></img>
                        </div>
                        <div className="col"><span className="">Log in with Google</span></div>
                      </div>
                    )}
                  }
                    cookiePolicy={'single_host_origin'}
                />
            </div>  
        </div>
        
        <div className='login-footer'>
            <div className="main-page-logo">
                <img id="app-logo" src="/icons/m2cLogo.png"  alt="" />
                <h3  className="col" style={{color:"#FD4D4D"}}>Meet2Code</h3>
            </div>
            
            <a className="main-page-git"  rel="noreferrer" href="https://github.com/exploring-curiosity/Meet2Code" target="_blank">
                <img id='github-icon' src='/icons/github.png' alt="img"></img>
            </a>
        </div>
    </div>
      );
}
export default Login;