import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initialState, helpers } from './helper_functions/reviews_module';
import RatingsBreakdown from './RatingsBreakdown.jsx';
import SubmitReview from './SubmitReview.jsx';
import ReviewsList from './ReviewsList.jsx';

function ReviewsModule({ product_id, product_name }) {
  const [reviewsDisplayed, setReviewsDisplayed] = useState(initialState.review);
  const [currentFilters, setCurrentFilters] = useState(initialState.filters);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [characteristics, setCharacteristics] = useState({});
  const [displayedCount, setDisplayedCount] = useState(2);
  const [sort, setSort] = useState('relevance');

  const reviews = useRef(initialState.review);
  const reviewCount = useRef(0);

  useEffect(() => {
    const count = 300;
    const params = {
      product_id,
      sort,
      count,
    };
    helpers.getReviews(params, currentFilters, (reviewData) => {
      reviews.current = reviewData;
      reviewCount.current = reviewData.length;
      helpers.filterReviews(
        reviews,
        currentFilters,
        displayedCount,
        setReviewsDisplayed
      );
    });
  }, [product_id, sort]);

  const filteredReviews = useMemo(() => {
    return helpers.filterReviews(
      reviews,
      currentFilters,
      displayedCount,
      setReviewsDisplayed
    );
  }, [currentFilters, displayedCount]);

  return (
    <div id="reviews-body">

      <div id="reviews-module">
        <h2 id="ratings-reviews"> Ratings and Reviews </h2>
        <RatingsBreakdown
          product_id={product_id}
          setCharacteristics={setCharacteristics}
          characteristics={characteristics}
          setCurrentFilters={setCurrentFilters}
          currentFilters={currentFilters}
        />
        {reviewsDisplayed.length === 0 ? (
          ''
        ) : (
          <ReviewsList
            reviews={reviewsDisplayed}
            setSortType={setSort}
            reviewCount={reviewCount.current}
          />
        )}
        <SubmitReview
          showReviewModal={showReviewModal}
          setShowReviewModal={setShowReviewModal}
          product_name={product_name}
          product_id={product_id}
          characteristics={characteristics}
        />
        <div id="main-buttons">
          <button
            className="reviews-btn"
            onClick={() =>
              setShowReviewModal((showReviewModal) => !showReviewModal)
            }
          >
            ADD A REVIEW +
          </button>
          <button
            id="more-reviews"
            className="reviews-btn"
            onClick={() =>
              helpers.handleCountShown(
                displayedCount,
                reviewCount,
                setDisplayedCount
              )
            }
          >
            MORE REVIEWS
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewsModule;
