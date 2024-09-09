import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import formatAmount from '../../libs/formatAmount';
import productCls from './ProductCard.module.scss';
import StarIcon from './images/star.svg';

interface ProductCardProps {
  title: string,
  productId: string,
  price: string,
  rating: number,
  src: string,
}

const ProductCard = memo<ProductCardProps>(({
  title, productId, price, rating, src,
}) => {
  const productLink = `/vehicles/${productId}`;

  const starsIcons = useMemo(() => {
    const ratingRounded = Number(rating.toFixed());
    const stars: React.ReactNode[] = [];

    for (let i = 0; i < ratingRounded; i += 1) {
      stars.push(<StarIcon key={i} className={productCls.starIconActive} />);
    }

    const diff = 5 - ratingRounded;

    if (diff) {
      for (let i = 0; i < diff; i += 1) {
        stars.push(<StarIcon key={i + ratingRounded} className={productCls.starIconInactive} />);
      }
    }

    return stars;
  }, [rating]);

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
      <div className={productCls.priceAndStarsBlock}>
        <div className={productCls.starsBlock}>
          {starsIcons}
        </div>
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
