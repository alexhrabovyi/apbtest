/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */
import {
  useState, useEffect, useMemo, useRef, useCallback,
  FormEvent,
} from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Review, useGetProductsQuery, VehicleProduct } from '../../queryAPI/queryAPI';
import findAllInteractiveElements from '../../libs/findAllInteractiveElements';
import formatAmount from '../../libs/formatAmount';
import { uninterestingProps, formattedFilterNames } from '../Main/Main';

import ThreeDotsSpinnerBlock from '../ThreeDotsSpinnerBlock/ThreeDotsSpinnerBlock';
import Slider from '../Slider/Slider';
import Button from '../Button/Button';

import containerCls from '../../scss/_container.module.scss';
import vehicleCls from './Vehicle.module.scss';

import StarIcon from './images/star.svg';

const MONTHS: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

export default function Product() {
  const params = useParams();

  const descTabPanelRef = useRef<HTMLDivElement | null>(null);
  const commentTabPanelRef = useRef<HTMLDivElement | null>(null);

  const [vehicleData, setVehicleData] = useState<VehicleProduct | null>(null);
  const [commentsInfo, setCommentsInfo] = useState<Review[] | null>(null);
  const [activeSlideId, setActiveSlideId] = useState<number>(0);
  const [isDescTabPanelActive, setIsDescTabPanelActive] = useState<boolean>(true);
  const [commentStars, setCommentStars] = useState(5);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [commentTextarea, setCommentTextarea] = useState('');

  const { vehicleId } = params;

  // fetch functions

  const { data: fetchedProduct, isLoading } = useGetProductsQuery();

  if (fetchedProduct && !vehicleData) {
    const currentVehicle = fetchedProduct.find((p) => p.id === Number(vehicleId));

    if (!currentVehicle) throw new Response(null, { status: 404 });

    setVehicleData(currentVehicle);
  }

  const setupCommentsInfo = useCallback(() => {
    if (!vehicleData) return;

    const fetchedComments = vehicleData.reviews;
    const allComments: Review[] = [...fetchedComments];
    const unparsedComments = localStorage.getItem('comments');

    if (unparsedComments) {
      const parsedComments = JSON.parse(unparsedComments);
      const currentVehicleComments = parsedComments[vehicleId!];

      if (currentVehicleComments) {
        allComments.push(...currentVehicleComments);
      }
    }

    setCommentsInfo(allComments);
  }, [vehicleData, vehicleId]);

  useEffect(setupCommentsInfo, [setupCommentsInfo]);

  // main slider functions

  const paginationBtns = useMemo(() => (
    vehicleData?.images?.map((src, i) => (
      <button
        key={src}
        type="button"
        className={classNames(
          vehicleCls.paginationBtn,
          i === activeSlideId && vehicleCls.paginationBtn_active,
        )}
        onClick={() => setActiveSlideId(i)}
        aria-label={`Go to slide ${i}`}
      >
        <img
          src={src}
          className={vehicleCls.paginationBtnImg}
          alt={vehicleData.title}
        />
      </button>
    ))
  ), [vehicleData, activeSlideId]);

  const slides = useMemo(() => {
    const result = vehicleData?.images?.map((src) => (
      <div
        key={src}
        className={vehicleCls.slide}
      >
        <img
          src={src}
          className={vehicleCls.slideImg}
          alt={vehicleData.title}
        />
      </div>
    ));

    return result;
  }, [vehicleData]);

  // tabs function

  const disableTabPanelElements = useCallback(() => {
    if (!vehicleData) return;

    let interactiveElems;

    if (isDescTabPanelActive) {
      interactiveElems = findAllInteractiveElements(commentTabPanelRef.current!);
    } else {
      interactiveElems = findAllInteractiveElements(descTabPanelRef.current!);
    }

    interactiveElems.forEach((el) => {
      el.tabIndex = -1;
      el.setAttribute('aria-hidden', String(true));
    });

    return () => {
      interactiveElems.forEach((el) => {
        el.tabIndex = 0;
        el.setAttribute('aria-hidden', String(false));
      });
    };
  }, [vehicleData, isDescTabPanelActive]);

  useEffect(disableTabPanelElements, [disableTabPanelElements]);

  // description and specs block

  const descriptionBlock = useMemo(() => {
    if (!vehicleData || !vehicleData.description) return;

    return (
      <div className={vehicleCls.descriptionBlock}>
        <p className={vehicleCls.descriptionSubtitle}>
          About vehicle
        </p>
        <p className={vehicleCls.descriptionText}>
          {vehicleData.description}
        </p>
      </div>
    );
  }, [vehicleData]);

  const specsBlock = useMemo(() => {
    if (!vehicleData) return;

    let allSpecs = Object.entries(vehicleData).filter(([key]) => {
      return !uninterestingProps.includes(key);
    });

    allSpecs = allSpecs.map(([key, value]) => {
      const formattedKey = formattedFilterNames[key] || key;

      return [formattedKey, value];
    });

    return (
      <div className={vehicleCls.specsBlock}>
        <p className={vehicleCls.specsTitle}>
          Specs
        </p>
        <ul className={vehicleCls.specsList}>
          {allSpecs.map(([name, value], i) => {
            if (typeof value === 'object') {
              value = value.join(', ');
            }

            return (
              <li
                key={i}
                className={vehicleCls.spec}
              >
                <p className={vehicleCls.specName}>
                  {`${name}:`}
                </p>
                <p className={vehicleCls.specValue}>
                  {value}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }, [vehicleData]);

  const commentsElements = useMemo(() => {
    if (!commentsInfo) return;

    const result = commentsInfo.map((r, index) => {
      const dateObj = new Date(r.date);
      const year = dateObj.getFullYear();
      const month = MONTHS[dateObj.getMonth() + 1];
      const day = dateObj.getDate();

      const { rating } = r;
      const stars: React.ReactNode[] = [];

      for (let i = 1; i <= rating; i += 1) {
        stars.push(
          <StarIcon key={i} className={vehicleCls.starActive} />,
        );
      }

      const ratingDiff = 5 - rating;

      for (let i = 1; i <= ratingDiff; i += 1) {
        stars.push(
          <StarIcon key={i + rating} className={vehicleCls.starInactive} />,
        );
      }

      return (
        <div key={index} className={vehicleCls.review}>
          <div className={vehicleCls.nameAndDate}>
            <p className={vehicleCls.reviewName}>
              {r.reviewerName}
            </p>
            <p className={vehicleCls.reviewDate}>
              {`${day} ${month} ${year}`}
            </p>
          </div>
          <div className={vehicleCls.starsBlock}>
            {stars}
          </div>
          <p className={vehicleCls.reviewText}>
            {r.comment}
          </p>
        </div>
      );
    });

    return result;
  }, [commentsInfo]);

  const createCommentStars = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let i = 1; i <= commentStars; i += 1) {
      result.push(
        <StarIcon
          key={i}
          className={vehicleCls.createCommentStarActive}
          onClick={() => setCommentStars(i)}
        />,
      );
    }

    const ratingDiff = 5 - commentStars;

    for (let i = 1; i <= ratingDiff; i += 1) {
      result.push(
        <StarIcon
          key={i + commentStars}
          className={vehicleCls.createCommentStarInactive}
          onClick={() => setCommentStars(i + commentStars)}
        />,
      );
    }

    return result;
  }, [commentStars]);

  const formOnSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const date = new Date().toISOString();

    const commentInfo = {
      rating: commentStars,
      comment: commentTextarea,
      reviewerName: nameInput,
      reviewerEmail: emailInput,
      date,
    };

    const commentUnparsed = localStorage.getItem('comments');
    const commentsInStorage = (commentUnparsed && JSON.parse(commentUnparsed)) || {};
    const thisVehicleComments = commentsInStorage[vehicleId!] || [];
    const newCommentsInStorage = {
      ...commentsInStorage,
      [vehicleId!]: [...thisVehicleComments, commentInfo],
    };

    localStorage.setItem('comments', JSON.stringify(newCommentsInStorage));

    setupCommentsInfo();

    setNameInput('');
    setEmailInput('');
    setCommentTextarea('');
  }, [commentStars, commentTextarea, emailInput, nameInput, vehicleId, setupCommentsInfo]);

  return (
    <main className={classNames(
      containerCls.container,
      vehicleCls.main,
      isLoading && vehicleCls.main_inactive,
    )}
    >
      {vehicleData ? (
        <>
          <div className={vehicleCls.mainBlock}>
            <div className={vehicleCls.imageSliderBlock}>
              <div className={vehicleCls.imagePaginationBlock}>
                {paginationBtns}
              </div>
              <Slider
                activeSlideId={activeSlideId}
                setActiveSlideId={setActiveSlideId}
                slides={slides!}
                gap={20}
              />
            </div>
            <div className={vehicleCls.titleAndPriceBlock}>
              <h1 className={vehicleCls.title}>
                {vehicleData?.title}
              </h1>
              <div className={vehicleCls.priceAndCartBlock}>
                <div className={vehicleCls.mainPriceBlock}>
                  <span className={vehicleCls.priceSpan}>
                    $
                  </span>
                  <p className={vehicleCls.mainPrice}>
                    {vehicleData?.price && formatAmount(vehicleData.price)}
                  </p>
                  {vehicleData?.discountPercentage && (
                    <div className={vehicleCls.discountBlock}>
                      {`-${vehicleData.discountPercentage!}%`}
                    </div>
                  )}
                </div>
                <div className={vehicleCls.cartBtnAndBannerBlock}>
                  <Button
                    className={vehicleCls.cartButton}
                    ariaLabel="Add to cart"
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={vehicleCls.tabList}
            role="tablist"
          >
            <button
              type="button"
              className={vehicleCls.tabButton}
              role="tab"
              aria-selected={isDescTabPanelActive}
              aria-controls="descriptionTabPanel"
              aria-label="Show description panel"
              onClick={() => setIsDescTabPanelActive(true)}
            >
              Description
              <span
                className={classNames(
                  vehicleCls.tabButtonLine,
                  isDescTabPanelActive && vehicleCls.tabButtonLine_active,
                )}
              />
            </button>
            <button
              type="button"
              className={vehicleCls.tabButton}
              role="tab"
              aria-selected={!isDescTabPanelActive}
              aria-controls="commentTabPanel"
              aria-label="Show review panel"
              onClick={() => setIsDescTabPanelActive(false)}
            >
              Reviews
              <span
                className={classNames(
                  vehicleCls.tabButtonLine,
                  !isDescTabPanelActive && vehicleCls.tabButtonLine_active,
                )}
              />
            </button>
          </div>
          <div className={vehicleCls.tabPanelsAndBannerBlock}>
            <div className={vehicleCls.tabPanels}>
              <div
                ref={descTabPanelRef}
                className={classNames(
                  vehicleCls.tabPanel,
                  isDescTabPanelActive && vehicleCls.tabPanel_active,
                )}
                id="descriptionTabPanel"
                role="tabpanel"
              >
                {descriptionBlock}
                {specsBlock}
              </div>
              <div
                ref={commentTabPanelRef}
                className={classNames(
                  vehicleCls.tabPanel,
                  !isDescTabPanelActive && vehicleCls.tabPanel_active,
                )}
                id="commentTabPanel"
                role="tabpanel"
              >
                <form
                  className={vehicleCls.commentForm}
                  onSubmit={formOnSubmit}
                >
                  <p className={vehicleCls.commentFormTitle}>
                    Leave your comment
                  </p>
                  <div className={vehicleCls.commentFormStars}>
                    {createCommentStars}
                  </div>
                  <div className={vehicleCls.inputsAndTextarea}>
                    <input
                      className={vehicleCls.input}
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={nameInput}
                      onInput={(e) => setNameInput((e.target as HTMLInputElement).value)}
                      required
                    />
                    <input
                      className={vehicleCls.input}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={emailInput}
                      onInput={(e) => setEmailInput((e.target as HTMLInputElement).value)}
                      required
                    />
                    <textarea
                      className={vehicleCls.textarea}
                      name="comment"
                      placeholder="Enter your comment"
                      value={commentTextarea}
                      onInput={(e) => setCommentTextarea((e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className={vehicleCls.submitButton}
                  >
                    Submit
                  </Button>
                </form>
                <span className={vehicleCls.commentBlockLine} />
                <div className={vehicleCls.reviews}>
                  {commentsElements}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ThreeDotsSpinnerBlock />
      )}
    </main>
  );
}
