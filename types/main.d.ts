import { customizeClone } from './clone';
import { customizeEquals } from './equals';
export { clone } from './clone';
export { equals } from './equals';
/**
 * Class decorators which allow the class' `equals` and `clone` implementations to be customized.
 * @public
 */
export declare namespace customize {
    const clone: typeof customizeClone;
    const equals: typeof customizeEquals;
}
