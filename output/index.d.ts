export default MouseFollower;
/**
 * Creates an SVG rect element that follows your mouse.
 *
 * @param disable       Whether or not the scroll effect will be enabled.
 * @param trailLength   How much the circle would extends
 * @param radius        The radius of the circle
 */
declare function MouseFollower({ disable, trailLength, radius }: {
    disable?: boolean;
    trailLength?: number;
    radius?: number;
}): any;
