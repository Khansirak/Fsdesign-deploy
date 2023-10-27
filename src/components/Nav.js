import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import FSlogo from '../images/fsdesignlogo.png'
import './nav.css';

const Nav = () => {
  // assigning location variable
  const location = useLocation();

  // destructuring pathname from location
  const { pathname } = location;

  // Javascript split method to get the name of the path in array
  const splitLocation = pathname.split('/');
  return (

    <>


<div className="d-flex flex-row justify-content-between ">
      <div className="d-flex flex-row text=center align-items-start ">
      
          <img alt="logo" src={FSlogo} className="image"  />
        
      <div>
        <ul className=" border d-flex justify-content-around list-unstyled p-2 ml-5 border-info" style={{backgroundColor: "#b7e778",color:"black"}}>
          <li >
            <Link to="/" style={{color:"black", fontWeight:'normal'}}>Menu</Link>
          </li>
          <li >
            <Link to="/try"style={{color:"black", fontWeight:'normal'}}>Try</Link>
          </li>
          <li>
            <Link to="/trf" style={{color:"black", fontWeight:'normal'}}>Tool</Link>
          </li>
          <li  >
            <Link to="/user" style={{color:"black", fontWeight:'normal'}}>PDF</Link>
          </li>
          <li >
            <Link to="/dfg"style={{color:"black", fontWeight:'normal'}}>Revision</Link>
          </li>
          <li  >
            <Link to="/fd"style={{color:"black", fontWeight:'normal'}}>Setting</Link>
          </li>
          <li  >
            <Link to="/srg"style={{color:"black", fontWeight:'normal'}}>Submit</Link>
          </li>
        </ul>
        </div>
      </div>
      <div className="ms-5 me-5" >
          <img alt="logo" className="image" />
        </div>
      </div>

      
    </>
  );
};
export default Nav;
