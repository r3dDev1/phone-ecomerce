import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import { ProductConsumer } from "../context";

class ProductsList extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="py-5">
          <div className="container" />
          <Title name="our" title="products" />
          <div className="row">
            <ProductConsumer>
              {value => {
                return value.products.map(product => {
                  return (
                    <Product
                      modalOpen={value.openModal}
                      addCart={value.addToCart}
                      seeDetails={value.handleDetail}
                      key={product.id}
                      details={product}
                    />
                  );
                });
              }}
            </ProductConsumer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProductsList;
