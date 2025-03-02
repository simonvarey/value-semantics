import { customizeClone } from './clone';
import { customizeEquals } from './equals';
export { clone } from './clone';
export { equals } from './equals';
export declare namespace customize {
    const clone: typeof customizeClone;
    const equals: typeof customizeEquals;
}
