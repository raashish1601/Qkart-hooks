import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [filteredproduct, setFProduct] = useState([]);
  const [filter, setFilter] = useState(true);
  const [log, setLog] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [items, setItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  let token = localStorage.getItem("token");

  const performAPICall = async () => {
    try {
      let response = await axios.get(`${config.endpoint}/products`);
      setProduct(response.data);
      setFProduct(response.data);
      setLog(false);
      return response.data;
    } catch (error) {
      if (error.response.status === 500) {
        enqueueSnackbar(error.response.data.message);
      } else {
        enqueueSnackbar(error.response.data.message);
      }
    }
  };

  const performSearch = async (text) => {
    try {
      let response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );

      if (response.data.length > 0) {
        setFProduct(response.data);
        setFilter(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setFProduct([]);
          setLog(false);
          setFilter(false);
        }

        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message);
          setLog(false);
          setFilter(false);
          setFProduct(product);
        }
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
        );
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(async () => {
      await performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const fetchCart = async (token) => {
    
    if (!token) return;
    else {
      try {
        // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
        const response = await axios.get(`${config.endpoint}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
       
        return response.data;
      } catch (e) {
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error"
            }
          );
        }
        return null;
      }
    }
  };

  const isItemInCart = (items, productId) => {

    let arr = items.filter((item) => {
      return item._id === productId;
    });
   
    if (arr.length === 0) {
      return false;
    }
    if (arr[0]._id === productId) {
      return true;
    }
    
  };

  useEffect(() => {
    
    async function onLoad() {
      let product1 = await performAPICall();
      let response = await fetchCart(token);
      let cartData = await generateCartItemsFrom(response, product1);
      setItems(cartData);
    }

    onLoad();
    // performAPICall()
  }, []);

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log(
      "add to CART",
      options.preventDuplicate,
      isItemInCart(items, productId)
    );
    console.log(token);

    if (!token) {
      enqueueSnackbar("Please login to add items to  cart", {
        variant: "warning"
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar("item already in cart", { variant: "warning" });
      return;
    }

    try {
      
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      

      setItems(generateCartItemsFrom(response.data, products));
      
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        console.log("post error");
        enqueueSnackbar(
          "Could not fetch products. Check if backend is running, reachable and returns valid JSON",
          { variant: "error" }
        );
      }
    }
  };

 

  return (
    <div>
      <Header hasHiddenAuthButtons="">
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            )
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e, debounceTimeout);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          )
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      />

      {/* Search view for mobiles */}

      <Grid container>
        <Grid item className="product-grid" md={token && 9}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {!log && filter && (
            <Grid container marginY="0.5rem" paddingX="1rem" spacing={2}>
              {filteredproduct.map((prod) => (
                <Grid item md={3} xs={6} key={prod._id}>
                  <ProductCard
                    product={prod}
                    handleAddToCart={async () => {
                      await addToCart(token, items, product, prod._id, 1, {
                        preventDuplicate: true
                      });
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {log && (
            <Box className="centers">
              <CircularProgress />
              <p>Loading products...</p>
            </Box>
          )}
          {!filter && (
            <Box className="centers">
              <SentimentDissatisfied />
              <p>No products found</p>
            </Box>
          )}
        </Grid>

        {token && (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart products={product} items={items} handleQuantity={addToCart} />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
