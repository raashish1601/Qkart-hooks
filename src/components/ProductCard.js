import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  //console.log(handleAddToCart)
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
        className="images"
        aria-label="stars"
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          ${product.cost}
        </Typography>
      </CardContent>
      <Rating name="simple-controlled" value={product.rating} />

      <CardActions className="card-actions">
        <Button
          className="card-button"
          variant="contained"
          onClick={handleAddToCart}
        >
          <AddShoppingCartOutlined
            fontSize="inherit"
            style={{ fontSize: "20px", marginRight: "8px" }}
          />
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
