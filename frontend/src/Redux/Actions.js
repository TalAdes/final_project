import * as CONSTANTS from "./Constants";

export const addItemInCart = item => ({
  type: CONSTANTS.ADD_ITEM_IN_CART,
  payload: item
});
export const deleteCartItem = id => ({
  type: CONSTANTS.DELETE_CART_ITEM,
  payload: id
});
export const updateCartItemQnt = obj => ({
  type: CONSTANTS.UPDATE_CART_ITEM_QUANTITY,
  payload: obj
});




export const setCheckedOutItems = items => ({
  type: CONSTANTS.SET_CHECKEDOUT_ITEMS,
  payload: items
});
export const setCartItems = items => ({
  type: CONSTANTS.SET_CART_ITEMS,
  payload: items
});




export const showCartDlg = status => ({
  type: CONSTANTS.SHOW_CART_DLG,
  payload: status
});
export const toggleMenu = (a=null) => ({
  type: CONSTANTS.TOGGLE_MENU,
  payload: a
});
export const toggleUserMenu = () => ({
  type: CONSTANTS.TOGGLE_USER_MENU,
  payload: null
});
export const setLoggedInUser = user => ({
  type: CONSTANTS.SET_LOGGED_IN_USER,
  payload: user
});
export const setLoggedInUserEmail = user => ({
  type: CONSTANTS.SET_LOGGED_IN_USER_EMAIL,
  payload: user
});
export const setLoggedInUserRole = user => ({
  type: CONSTANTS.SET_LOGGED_IN_USER_ROLE,
  payload: user
});
export const setMenuStatus = status => ({
  type: CONSTANTS.SET_MENU_STATUS,
  payload: status
});
