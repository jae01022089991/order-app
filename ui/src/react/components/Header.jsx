import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <h1 className="brand">COZY</h1>
                <nav>
                    <ul className="nav-list">
                        <li><Link className="nav-link" to="/">주문하기</Link></li>
                        <li><Link className="nav-link" to="/admin">관리자</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;