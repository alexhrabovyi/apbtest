import { memo } from 'react';
import { Link } from 'react-router-dom';
import formatAmount from '../../libs/formatAmount';
import productCls from './ProductCard.module.scss';

interface ProductCardProps {
  title: string,
  productId: string,
  price: string,
  src: string,
}

const ProductCard = memo<ProductCardProps>(({
  title, productId, price, src,
}) => {
  const productLink = `/vehicles/${productId}`;

  return (
    <div className={productCls.card}>
      <Link
        className={productCls.imageLink}
        to={productLink}
      >
        <img
          className={productCls.image}
          src={src}
          alt={title}
        />
      </Link>
      <Link
        className={productCls.textLink}
        to={productLink}
      >
        {title}
      </Link>
      <div className={productCls.priceAndCartBlock}>
        <div className={productCls.priceBlock}>
          <p className={productCls.price}>
            <span className={productCls.priceSpan}>$</span>
            {formatAmount(Number(price))}
          </p>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
