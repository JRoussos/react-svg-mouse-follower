import React, { useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

var MouseFollower = function MouseFollower(_ref) {
  var _ref$disable = _ref.disable,
    disable = _ref$disable === void 0 ? false : _ref$disable,
    _ref$trailLength = _ref.trailLength,
    trailLength = _ref$trailLength === void 0 ? 40 : _ref$trailLength,
    _ref$radius = _ref.radius,
    radius = _ref$radius === void 0 ? 60 : _ref$radius;
  var _useRef = useRef({
      x: 0,
      y: 0
    }),
    mousePreviousPosition = _useRef.current;
  var _useRef2 = useRef({
      x: 0,
      y: 0
    }),
    mouseCurrentPosition = _useRef2.current;
  var _useRef3 = useRef({
      x: null,
      y: null,
      rotate: null,
      scaleX: null,
      scaleY: null
    }),
    quickSet = _useRef3.current;
  var isMouseOffScreen = useRef(true);
  var rect = useMemo(function () {
    return {
      coords: 110 - radius / 2,
      corner: radius / 2
    };
  }, [radius]);
  var render = useCallback(function () {
    var getRotation = function getRotation(x, y) {
      return Math.atan2(y, x) * 180 / Math.PI;
    };
    var getDistance = function getDistance(x, y) {
      return Math.min(Math.sqrt(x * x + y * y), trailLength);
    };
    var rotation = getRotation(mousePreviousPosition.x, mousePreviousPosition.y);
    var distance = getDistance(mousePreviousPosition.x, mousePreviousPosition.y);
    quickSet.x(mouseCurrentPosition.x);
    quickSet.y(mouseCurrentPosition.y);
    quickSet.width(radius + distance);
    quickSet.rotate(rotation);
  }, [radius, trailLength]);
  var handleMouseLeave = function handleMouseLeave(event) {
    event.stopPropagation();
    isMouseOffScreen.current = true;
    gsap.to('#cursor', {
      id: 'hideCursor',
      duration: 0.5,
      delay: 1,
      opacity: 0
    });
  };
  var handleMouseMove = function handleMouseMove(_ref2) {
    var clientX = _ref2.clientX,
      clientY = _ref2.clientY;
    if (isMouseOffScreen.current) {
      var _gsap$getById;
      mouseCurrentPosition.x = clientX;
      mouseCurrentPosition.y = clientY;
      isMouseOffScreen.current = false;
      (_gsap$getById = gsap.getById('hideCursor')) === null || _gsap$getById === void 0 ? void 0 : _gsap$getById.kill();
      gsap.to('#cursor', {
        duration: 0.5,
        opacity: 1
      });
      return;
    }
    gsap.to(mouseCurrentPosition, {
      duration: 1.2,
      x: clientX,
      y: clientY,
      ease: 'expo.out',
      onUpdate: function onUpdate() {
        mousePreviousPosition.x = clientX - mouseCurrentPosition.x;
        mousePreviousPosition.y = clientY - mouseCurrentPosition.y;
      }
    });
  };
  useLayoutEffect(function () {
    if (disable) {
      isMouseOffScreen.current = true;
      return gsap.ticker.remove(render);
    }
    quickSet.x = gsap.quickSetter('#cursor', 'x', 'px');
    quickSet.y = gsap.quickSetter('#cursor', 'y', 'px');
    quickSet.rotate = gsap.quickSetter('#cursor', 'rotate', 'deg');
    quickSet.width = gsap.quickSetter('#rect', 'width');
    gsap.ticker.add(render);
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    return function () {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disable, render, handleMouseMove, handleMouseLeave]);
  return disable ? null : /*#__PURE__*/React.createElement("svg", {
    id: "cursor",
    width: "220",
    height: "220",
    viewBox: "0 0 220 220",
    fill: "none",
    style: {
      position: 'fixed',
      top: '-109px',
      left: '-109px',
      opacity: 0,
      pointerEvents: 'none',
      willChange: 'transform',
      mixBlendMode: 'difference',
      zIndex: 200
    }
  }, /*#__PURE__*/React.createElement("rect", {
    id: "rect",
    x: rect.coords,
    y: rect.coords,
    width: radius,
    height: radius,
    rx: rect.corner,
    stroke: "white",
    strokeOpacity: "0.8",
    strokeWidth: "2px",
    fillOpacity: "0",
    fill: "white"
  }));
};

export default MouseFollower;
//# sourceMappingURL=index.modern.js.map
