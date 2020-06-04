import React from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';

import {Route} from 'react-router-dom';

function App() {
  return (
    <div>
      <Layout>
        <Route path="/" exact component={BurgerBuilder}/>
        <Route path="/auth" exact component={Auth}/>
        <Route path="/logout" exact component={Logout}/>
        <Route path="/orders" exact component={Orders}/>
        <Route path="/checkout" component={Checkout}/>
      </Layout>
    </div>
  );
}

export default App;
