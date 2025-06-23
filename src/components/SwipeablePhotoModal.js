import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSwipeable } from "react-swipeable";

const SwipeablePhotoModal = ({ show, onClose, photos, user, spotId }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [animating, setAnimating] = useState(false);

    const getPrevIndex = () => (currentPhotoIndex - 1 + photos.length) % photos.length;
    const getNextIndex = () => (currentPhotoIndex + 1) % photos.length;

    const getPhotoSrc = (index) => {
        const photo = photos[index];
        if (!photo) return "";
        if (photo.photoPath) {
            return `https://newloripinbucket.s3.amazonaws.com/image/spots/${photo.photoPath}`;
        }
        return `https://newloripinbucket.s3.amazonaws.com/image/spots/${user?.username}/${spotId}/${photo.name}`;
    };

    const swipeHandlers = useSwipeable({
        onSwiping: (e) => {
            if (!animating) {
                setSwipeOffset(e.deltaX);
            }
        },
        onSwiped: (e) => {
            const threshold = window.innerWidth / 8;
            if (e.deltaX > threshold) {
                animateSwipe("right");
            } else if (e.deltaX < -threshold) {
                animateSwipe("left");
            } else {
                resetPosition();
            }
        },
        trackTouch: true,
        preventScrollOnSwipe: true,
    });


    const animateSwipe = (direction) => {
        setAnimating(true);
        const finalOffset = direction === "left" ? -window.innerWidth : window.innerWidth;
        setSwipeOffset(finalOffset);
        setTimeout(() => {
            setCurrentPhotoIndex((prev) =>
                direction === "left" ? getNextIndex() : getPrevIndex()
            );
            setSwipeOffset(0);
            setAnimating(false);
        }, 300);
    };

    const resetPosition = () => {
        setAnimating(true);
        setSwipeOffset(0);
        setTimeout(() => setAnimating(false), 300);
    };

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].clientX;
        if (Math.abs(touchEndX - touchStartX) < 5) {
            onClose();
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            fullscreen
            dialogClassName="borderless-modal"
        >
            <Modal.Body
                {...swipeHandlers}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={(e) => {
                    if (e.target.tagName === "IMG") return;
                    onClose();
                }}
                style={{ padding: 0, touchAction: "none" }}
            >
                <div className="photo-container">
                    <div
                        className="photo-wrapper"
                        style={{
                            transform: `translateX(calc(-100% + ${swipeOffset}px))`,
                            transition: animating ? "transform 0.3s ease" : "none",
                        }}
                    >
                        {[getPrevIndex(), currentPhotoIndex, getNextIndex()].map((index, i) => (
                            <div key={i} className="photo-slide">
                                <img
                                    src={getPhotoSrc(index)}
                                    alt={`Photo ${index}`}
                                    style={{
                                        width: "100%",
                                        height: "100vh",
                                        objectFit: "contain",
                                        userSelect: "none",
                                        pointerEvents: "none"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    {window.innerWidth > 768 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    animateSwipe("right");
                                }}
                                className="nav-arrow nav-left"
                            >
                                &#8249;
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    animateSwipe("left");
                                }}
                                className="nav-arrow nav-right"
                            >
                                &#8250;
                            </button>


                        </>
                    )}
                </div>
            </Modal.Body>

        </Modal>
    );
};

export default SwipeablePhotoModal;
