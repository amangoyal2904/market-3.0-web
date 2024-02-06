import Image from 'next/image';
import React from 'react'
import styles from './Header.module.scss'
import Link from 'next/link';
import Search from '../Search';
import Login from '../Login';
import { APP_ENV } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import { GLOBAL_CONFIG } from "../../network/global_config";

const Header = () => {
  const { state, dispatch } = useStateContext();
  const { isLogin, isPrime } = state.login;

  return (
    <header id={styles.pageTopbar}>
      <div className={styles.navbarHeader}>
        <div className="dflex align-item-center">
          <Link href="/">
            <Image 
              src="/logo.png"
              width={138}
              height={24}
              alt="ET Markets"
              />
          </Link>
          <Search/>
        </div>        
        <div className="dflex align-item-center">
          <Link className="default-btn" href="/watchlist">My Watchlist</Link>
          {
            !isPrime && <Link className="default-btn" href={`${(GLOBAL_CONFIG as any)[APP_ENV]["Plan_PAGE"]}`} data-ga-onclick="Subscription Flow#SYFT#ATF - url">Subscribe</Link>
          }
          <Login />
        </div>
      </div>
    </header>
  )
}

export default Header;
