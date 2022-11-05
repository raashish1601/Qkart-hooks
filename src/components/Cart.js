import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

let token = localStorage.getItem("token");

export const generateCartItemsFrom = (cartData = [], productsData = []) => {
  let returned = [];
  for (let i = 0; i < cartData.length; i++) {
    let cart = cartData[i];
    let arr = productsData.filter((prod) => {
      if (prod._id === cart.productId) {
        prod.qty = cart.qty;
        return prod;
      }
    });
    Array.prototype.push.apply(returned, arr);
  }

  return returned;
};

export const getTotalCartValue = (items = []) => {
  let sum = 0;
  let total = items.map((item) => {
    return item.cost * item.qty;
  });

  for (let i = 0; i < total.length; i++) {
    sum = sum + total[i];
  }
  return sum;
};

export const getTotalItems = (items = []) => {
  let quantity = 0;
  let total = items.map((item) => {
    return item.qty;
  });

  for (let i = 0; i < total.length; i++) {
    quantity = quantity + total[i];
  }
  return quantity;
};

const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  //console.log(value,handleAdd,handleDelete)
  if (isReadOnly) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      </Stack>
    );
  }
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  let token = localStorage.getItem("token");
  const history = useHistory();
  //console.log("from cart",products,items)
  if (items.length === 0) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  if (isReadOnly) {
    return (
      <Box className="parent1">
        <Box className="cart">
          {items.map((cart) => (
            <Box
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              key={cart._id}
            >
              <Box className="image-container">
                <img
                  // Add product image
                  src={cart.image}
                  // Add product name as alt eext
                  alt={cart.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{/* Add product name */ cart.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <ItemQuantity
                    // Add required props by checking implementation
                    value={cart.qty}
                    isReadOnly
                  />
                  <Box padding="0.5rem" fontWeight="700">
                    ${/* Add product cost */ cart.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            //alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </Box>

        <Box className="Cart-inner">
          <Box
            padding="0.3rem"
            display="flex"
            justifyContent="space-between"
            //alignItems="center"
          >
            <Box
              color="#3C3C3C"
              alignSelf="center"
              fontSize="larger"
              fontWeight="bolder"
            >
              Order Details
            </Box>
          </Box>

          <Box
            padding="0.3rem"
            display="flex"
            justifyContent="space-between"

            //alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Products
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              data-testid="cart-total"
              fontSize="medium"
              fontWeight="medium"
            >
              {getTotalItems(items)}
            </Box>
          </Box>

          <Box
            padding="0.3rem"
            display="flex"
            justifyContent="space-between"
            //alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Subtotal
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              data-testid="cart-total"
              fontSize="medium"
              fontWeight="medium"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>

          <Box
            padding="0.3rem"
            display="flex"
            justifyContent="space-between"
            //alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Shipping Charges
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              data-testid="cart-total"
              fontSize="medium"
              fontWeight="medium"
            >
              $0
            </Box>
          </Box>

          <Box
            padding="0.3rem"
            display="flex"
            justifyContent="space-between"
            //alignItems="center"
          >
            <Box
              color="#3C3C3C"
              alignSelf="center"
              fontSize="larger"
              fontWeight="bolder"
            >
              Total
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              data-testid="cart-total"
              fontSize="medium"
              fontWeight="bolder"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="cart">
      {items.map((cart) => (
        <Box
          display="flex"
          alignItems="flex-start"
          padding="1rem"
          key={cart._id}
        >
          <Box className="image-container">
            <img
              // Add product image
              src={cart.image}
              // Add product name as alt eext
              alt={cart.name}
              width="100%"
              height="100%"
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
          >
            <div>{/* Add product name */ cart.name}</div>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <ItemQuantity
                // Add required props by checking implementation
                value={cart.qty}
                handleAdd={() => {
                  handleQuantity(
                    token,
                    items,
                    products,
                    cart._id,
                    cart.qty + 1
                  );
                }}
                handleDelete={() => {
                  handleQuantity(
                    token,
                    items,
                    products,
                    cart._id,
                    cart.qty - 1
                  );
                }}
              />
              <Box padding="0.5rem" fontWeight="700">
                ${/* Add product cost */ cart.cost}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}

      <Box
        padding="1rem"
        display="flex"
        justifyContent="space-between"
        //alignItems="center"
      >
        <Box color="#3C3C3C" alignSelf="center">
          Order total
        </Box>
        <Box
          color="#3C3C3C"
          fontWeight="700"
          fontSize="1.5rem"
          alignSelf="center"
          data-testid="cart-total"
        >
          ${getTotalCartValue(items)}
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" className="cart-footer">
        <Button
          color="primary"
          variant="contained"
          startIcon={<ShoppingCart />}
          className="checkout-btn"
          onClick={() => {
            history.push("/checkout");
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
