"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var gsap_1 = require("gsap");
/**
 * Creates an SVG rect element that follows your mouse.
 *
 * @param disable       Whether or not the scroll effect will be enabled.
 * @param trailLength   How much the circle would extends
 * @param radius        The radius of the circle
 */
var MouseFollower = function (_a) {
    var _b = _a.disable, disable = _b === void 0 ? false : _b, _c = _a.trailLength, trailLength = _c === void 0 ? 40 : _c, _d = _a.radius, radius = _d === void 0 ? 60 : _d;
    var mousePreviousPosition = (0, react_1.useRef)({ x: 0, y: 0 }).current;
    var mouseCurrentPosition = (0, react_1.useRef)({ x: 0, y: 0 }).current;
    var quickSet = (0, react_1.useRef)({ x: null, y: null, rotate: null, scaleX: null, scaleY: null }).current;
    var isMouseOffScreen = (0, react_1.useRef)(true);
    var rect = (0, react_1.useMemo)(function () { return ({ coords: 110 - radius / 2, corner: radius / 2 }); }, [radius]);
    var render = (0, react_1.useCallback)(function () {
        var getRotation = function (x, y) { return Math.atan2(y, x) * 180 / Math.PI; }; // return the angle converted in degrees from radians
        var getDistance = function (x, y) { return Math.min(Math.sqrt(x * x + y * y), trailLength); }; // return the distance between the x and y value of the previous position 
        var rotation = getRotation(mousePreviousPosition.x, mousePreviousPosition.y);
        var distance = getDistance(mousePreviousPosition.x, mousePreviousPosition.y);
        quickSet.x(mouseCurrentPosition.x);
        quickSet.y(mouseCurrentPosition.y);
        quickSet.width(radius + distance);
        quickSet.rotate(rotation);
    }, [radius, trailLength]);
    var handleMouseLeave = function (event) {
        event.stopPropagation();
        isMouseOffScreen.current = true;
        gsap_1.gsap.to('#cursor', { id: 'hideCursor', duration: 0.5, delay: 1, opacity: 0 });
    };
    var handleMouseMove = function (_a) {
        var _b;
        var clientX = _a.clientX, clientY = _a.clientY;
        if (isMouseOffScreen.current) {
            mouseCurrentPosition.x = clientX;
            mouseCurrentPosition.y = clientY;
            isMouseOffScreen.current = false;
            (_b = gsap_1.gsap.getById('hideCursor')) === null || _b === void 0 ? void 0 : _b.kill();
            gsap_1.gsap.to('#cursor', { duration: 0.5, opacity: 1 });
            return;
        }
        gsap_1.gsap.to(mouseCurrentPosition, { duration: 1.2, x: clientX, y: clientY, ease: 'expo.out', onUpdate: function () {
                mousePreviousPosition.x = clientX - mouseCurrentPosition.x; // distance from the actual x position to the current position one
                mousePreviousPosition.y = clientY - mouseCurrentPosition.y; // distance from the actual y position to the current position one
            } });
    };
    (0, react_1.useLayoutEffect)(function () {
        if (disable) {
            isMouseOffScreen.current = true;
            return gsap_1.gsap.ticker.remove(render);
        }
        quickSet.x = gsap_1.gsap.quickSetter('#cursor', 'x', 'px');
        quickSet.y = gsap_1.gsap.quickSetter('#cursor', 'y', 'px');
        quickSet.rotate = gsap_1.gsap.quickSetter('#cursor', 'rotate', 'deg');
        quickSet.width = gsap_1.gsap.quickSetter('#rect', 'width');
        gsap_1.gsap.ticker.add(render);
        document.body.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        return function () {
            document.body.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [disable, render, handleMouseMove, handleMouseLeave]);
    return disable ? null : (<svg id="cursor" width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'fixed', top: '-109px', left: '-109px', opacity: 0, pointerEvents: 'none', willChange: 'transform', mixBlendMode: 'difference', zIndex: 200 }}>
            <rect id="rect" x={rect.coords} y={rect.coords} width={radius} height={radius} rx={rect.corner} stroke="white" strokeOpacity="0.8" strokeWidth="2px" fillOpacity="0" fill="white"/>
        </svg>);
};
exports.default = MouseFollower;
