import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const {component: Component, ...rest} = props
  const jwtToken = Cookies.get('jwt_token')
  
  return (
    <Route
      {...rest}
      render={props => {
        if (jwtToken === undefined) {
          return <Redirect to="/login" />
        }
        return <Component {...props} />
      }}
    />
  )
}

export default ProtectedRoute
