import Image from 'next/image';
import React from 'react'
import styles from './Header.module.scss'
import Link from 'next/link';
import Search from '../Search';
import Login from '../Login';

const Header = () => {
  return (
    <header id={styles.pageTopbar}>
      <div className={styles.navbarHeader}>
        <div className="dflex align-item-center">
          <Image 
            src="/logo.png"
            width={138}
            height={24}
            alt="ET Markets"
            />
            <Search/>
        </div>        
        <div className="dflex align-item-center">
          <Link className="default-btn" href="/watchlist">My Watchlist</Link>
          <Link className="default-btn" href="/plans.cms" data-ga-onclick="Subscription Flow#SYFT#ATF - url">Subscribe</Link>
          <Login />
        </div>
      </div>
    </header>
  )
}

export default Header;
