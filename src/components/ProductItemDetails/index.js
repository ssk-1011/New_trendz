import React from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {TailSpin as Loader} from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import CartContext from '../../context/CartContext'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends React.Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    console.log('Component Mounted with props:', this.props)
    this.getProductData()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    const {match: prevMatch} = prevProps
    if (match.params.id !== prevMatch.params.id) {
      console.log('ID Changed from', prevMatch.params.id, 'to', match.params.id)
      this.getProductData()
    }
  }

  getFormattedData = data => {
    if (!data) {
      console.error('No data provided to getFormattedData')
      return {}
    }
    console.log('Formatting data:', data)
    return {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      title: data.title,
      totalReviews: data.total_reviews,
    }
  }

  getProductData = async () => {
    const {match} = this.props
    const {id} = match.params
    console.log('Fetching data for ID:', id)
    
    if (!id) {
      console.error('No ID provided')
      this.setState({apiStatus: apiStatusConstants.failure})
      return
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    
    if (!jwtToken) {
      console.error('No JWT token found')
      this.setState({apiStatus: apiStatusConstants.failure})
      return
    }

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    console.log('API URL:', apiUrl)
    
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      console.log('Making API request...')
      const response = await fetch(apiUrl, options)
      console.log('API Response Status:', response.status)
      
      if (response.ok) {
        const fetchedData = await response.json()
        console.log('Fetched Data:', fetchedData)
        
        if (!fetchedData) {
          throw new Error('No data received from API')
        }

        const updatedData = this.getFormattedData(fetchedData)
        const updatedSimilarProductsData = fetchedData.similar_products.map(
          eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
        )

        console.log('Formatted Product Data:', updatedData)
        console.log('Formatted Similar Products:', updatedSimilarProductsData)

        this.setState({
          productData: updatedData,
          similarProductsData: updatedSimilarProductsData,
          apiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 404) {
        console.log('Product Not Found')
        this.setState({apiStatus: apiStatusConstants.failure})
      } else {
        throw new Error(`API Error: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderLoadingView = () => {
    console.log('Rendering Loading View')
    return (
      <div className="products-details-loader-container" data-testid="loader">
        <Loader type="TailSpin" color="#0b69ff" height="50" width="50" />
      </div>
    )
  }

  renderFailureView = () => {
    console.log('Rendering Failure View')
    return (
      <div className="product-details-error-view-container">
        <img
          alt="error view"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="error-view-image"
        />
        <h1 className="product-not-found-heading">Product Not Found</h1>
        <Link to="/products">
          <button type="button" className="button">
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    console.log('Rendering Product Details View with:', {
      productData,
      quantity,
      similarProductsCount: similarProductsData.length,
    })

    if (!productData || Object.keys(productData).length === 0) {
      console.error('No product data available')
      return this.renderFailureView()
    }

    return (
      <CartContext.Consumer>
        {value => {
          if (!value) {
            console.error('CartContext value is undefined')
            return this.renderFailureView()
          }

          const {
            availability,
            brand,
            description,
            imageUrl,
            price,
            rating,
            title,
            totalReviews,
          } = productData
          const {addCartItem} = value

          const onClickAddToCart = () => {
            console.log('Adding to cart:', {...productData, quantity})
            addCartItem({...productData, quantity})
          }

          return (
            <div className="product-details-success-view">
              <div className="product-details-container">
                <img src={imageUrl} alt="product" className="product-image" />
                <div className="product">
                  <h1 className="product-name">{title}</h1>
                  <p className="price-details">Rs {price}/-</p>
                  <div className="rating-and-reviews-count">
                    <div className="rating-container">
                      <p className="rating">{rating}</p>
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                        alt="star"
                        className="star"
                      />
                    </div>
                    <p className="reviews-count">{totalReviews} Reviews</p>
                  </div>
                  <p className="product-description">{description}</p>
                  <div className="label-value-container">
                    <p className="label">Available:</p>
                    <p className="value">{availability}</p>
                  </div>
                  <div className="label-value-container">
                    <p className="label">Brand:</p>
                    <p className="value">{brand}</p>
                  </div>
                  <hr className="horizontal-line" />
                  <div className="quantity-container">
                    <button
                      type="button"
                      className="quantity-controller-button"
                      onClick={this.onDecrementQuantity}
                      data-testid="minus"
                    >
                      <BsDashSquare className="quantity-controller-icon" />
                    </button>
                    <p className="quantity">{quantity}</p>
                    <button
                      type="button"
                      className="quantity-controller-button"
                      onClick={this.onIncrementQuantity}
                      data-testid="plus"
                    >
                      <BsPlusSquare className="quantity-controller-icon" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="button add-to-cart-btn"
                    onClick={onClickAddToCart}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
              <h1 className="similar-products-heading">Similar Products</h1>
              <ul className="similar-products-list">
                {similarProductsData.map(eachSimilarProduct => (
                  <SimilarProductItem
                    productDetails={eachSimilarProduct}
                    key={eachSimilarProduct.id}
                  />
                ))}
              </ul>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    console.log('Current API Status:', apiStatus)
    
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        console.log('Unknown API Status:', apiStatus)
        return null
    }
  }

  render() {
    console.log('Rendering ProductItemDetails with state:', this.state)
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
