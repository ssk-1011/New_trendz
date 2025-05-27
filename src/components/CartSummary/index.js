import CartContext from '../../context/CartContext'

import './index.css'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList, removeAllCartItems} = value
      const itemsCount = cartList.length
      const totalAmount = cartList.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      )

      const onRemoveAllItems = () => {
        removeAllCartItems()
      }

      return (
        <div className="cart-summary-container">
          <h1 className="order-total-value">
            <span className="order-total-label">Order Total:</span> Rs{' '}
            {totalAmount}/-
          </h1>
          <p className="total-items">{itemsCount} Items in cart</p>
          <button
            type="button"
            className="checkout-button d-sm-none"
            onClick={onRemoveAllItems}
          >
            Remove All
          </button>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
