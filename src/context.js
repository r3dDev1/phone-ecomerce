import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";

const ProductContext = React.createContext();
// provider
// Consumer

class ProductProvider extends Component {
  constructor(props) {
    super();
    this.state = {
      //[...storeProducts]  distructuring won't work here because the objects are nested within the array
      products: [],
      detailProduct: detailProduct,
      cart: [],
      modalOpen: false,
      modalProduct: {},
      cartSubTotal: 0,
      cartTax: 0,
      cartTotal: 0
    };
    this.handleDetail = this.handleDetail.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.remove = this.remove.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  componentDidMount() {
    this.setProducts();
  }

  setProducts() {
    let products = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      products = [...products, singleItem];
    });
    this.setState({
      products: products
    });
  }

  getItem(id) {
    const product = this.state.products.find(item => item.id === id);
    return product;
  }

  handleDetail(id) {
    // changes detailProduct with information of the clicked phone based on id
    const product = this.getItem(id);
    this.setState({
      detailProduct: product
    });
  }

  addToCart(id) {
    let temp = [...this.state.products];
    const index = temp.indexOf(this.getItem(id));
    const product = temp[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      {
        products: temp,
        cart: [...this.state.cart, product]
      },
      () => {
        this.addTotals();
      }
    );
  }

  openModal(id) {
    const product = this.getItem(id);
    this.setState({
      modalProduct: product,
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  increment(id) {
    let tempCart = [...this.state.cart];
    const selected = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selected);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState(
      {
        cart: [...tempCart]
      },
      () => {
        this.addTotals();
      }
    );
  }

  decrement(id) {
    let tempCart = [...this.state.cart];
    const selected = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selected);
    const product = tempCart[index];
    product.count = product.count - 1;
    if (product.count === 0) {
      this.remove(id);
    } else {
      product.total = product.count * product.price;
      this.setState(
        {
          cart: [...tempCart]
        },
        () => {
          this.addTotals();
        }
      );
    }
  }

  remove(id) {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter(item => item.id !== id);
    const index = tempProducts.indexOf(this.getItem(id));

    let removedProduct = tempProducts[index];

    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    this.setState(
      {
        cart: [...tempCart],
        products: [...tempProducts]
      },
      () => {
        this.addTotals();
      }
    );
  }

  clearCart() {
    this.setState(
      {
        cart: []
      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  }

  addTotals() {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState({
      cartSubTotal: subTotal,
      cartTax: tax,
      cartTotal: total
    });
  }

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          remove: this.remove,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;

export { ProductConsumer, ProductProvider };
