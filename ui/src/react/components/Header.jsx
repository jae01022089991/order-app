import React from 'react';

const Header = () => {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <h1 className="brand">COZY</h1>
                <nav>
                    <ul className="nav-list">
                        <li><a className="nav-link" href="#order">주문하기</a></li>
                        <li><a className="nav-link" href="#admin">관리자</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;