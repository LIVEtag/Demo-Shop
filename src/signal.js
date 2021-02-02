export const SIGNAL_INIT = 'livetag/init';
export const SIGNAL_READY = 'livetag/ready';
export const SIGNAL_CLOSE = 'livetag/close';
export const SIGNAL_MINIMIZE = 'livetag/minimize';
export const SIGNAL_RESTORE = 'livetag/restore';
export const SIGNAL_PRODUCT_ADD_TO_CART = 'livetag/product/addToCart';
export const SIGNAL_PRODUCT_VIEW = 'livetag/product/view';
export const SIGNAL_CHECKOUT = 'livetag/checkout';

export const createSignal = (type, payload = null) => ({ type, payload });
