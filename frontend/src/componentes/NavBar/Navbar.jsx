import React from 'react'
import './navbar.css'

import ReorderIcon from '@mui/icons-material/Reorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="nav-container">
        <nav className="navbar">
            <div className="nav-left">
                <ReorderIcon className="nav-icons"/>
            </div>
            <div className="nav-center">
                VYNCE
            </div>
            <div className="nav-right">
                <SearchIcon className="nav-icons"/>
                <PersonIcon className="nav-icons"/>
                <ShoppingCartIcon className="nav-icons"/>
            </div>
        </nav>
    </div>
  )
}
