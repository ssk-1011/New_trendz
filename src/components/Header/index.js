import {Link, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import {MdShoppingCart} from 'react-icons/md'

import CartContext from '../../context/CartContext'

import './index.css'

const Header = () => {
  const history = useHistory()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const cartItemsCount = cartList.length

        return (
          <header className="header-container">
            <div className="header-content">
              <Link to="/" className="website-logo">
                Nxt Trendz
              </Link>
              <nav className="nav-menu">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/products" className="nav-link">
                  Products
                </Link>
              </nav>
              <div className="nav-items-container">
                <button
                  type="button"
                  className="search-button"
                  onClick={() => history.push('/products')}
                >
                  <BsSearch className="search-icon" />
                </button>
                <Link to="/cart" className="cart-link">
                  <MdShoppingCart className="cart-icon" />
                  <span className="cart-count-badge">{cartItemsCount}</span>
                </Link>
                <button
                  type="button"
                  className="logout-desktop-btn"
                  onClick={onClickLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
        )
      }}
    </CartContext.Consumer>
  )
}

export default Header
