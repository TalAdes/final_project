import * as CONSTANTS from "./Constants";

// If multiple components need access to some data, in that case we store such data in redux.
const initialState = {
  cartItems: [],
  showCartDialog: false,
  showMenu: true,
  showUserMenu: false,
  checkedOutItems: [],
  loggedInUser: null,
  loggedInUserRole: null,
  menuStatus:CONSTANTS.store // store/my area/managment
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.ADD_ITEM_IN_CART: {
      let index = state.cartItems.findIndex(x => x.id === action.payload.id);

      // Is the item user wants to add already in the cart?
      if (index !== -1) {
        // Yes, update the quantity.
        let cloneCartItems = [...state.cartItems];
        cloneCartItems[index] = {
          ...cloneCartItems[index],
          quantity: state.cartItems[index].quantity + action.payload.quantity
        };

        return { ...state, cartItems: cloneCartItems };
      }

      // No, add a new item.
      return { ...state, cartItems: state.cartItems.concat(action.payload) };
    }
    case CONSTANTS.DELETE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.id !== action.payload)
      };
    case CONSTANTS.UPDATE_CART_ITEM_QUANTITY: {
      let index = state.cartItems.findIndex(x => x.id === action.payload.id);

      // User wants to update quantity of existing item.
      if (index !== -1) {
        let cloneCartItems = [...state.cartItems];
        cloneCartItems[index] = {
          ...cloneCartItems[index],
          quantity: action.payload.quantity
        };

        return { ...state, cartItems: cloneCartItems };
      }

      // If we couldn't find such item, do nothing.
      return state;
    }
    
    
    
    case CONSTANTS.SET_CART_ITEMS:
      return { ...state, cartItems: action.payload };
    case CONSTANTS.SET_CHECKEDOUT_ITEMS:
      return { ...state, checkedOutItems: action.payload };
    
    
    case CONSTANTS.SHOW_CART_DLG:
      return { ...state, showCartDialog: action.payload };
    case CONSTANTS.TOGGLE_MENU:
      if(action.payload !== null)
        return { ...state, showMenu: action.payload };
      return { ...state, showMenu: !state.showMenu };
    case CONSTANTS.TOGGLE_USER_MENU:
      return { ...state, showUserMenu: !state.showUserMenu };
    case CONSTANTS.SET_LOGGED_IN_USER:
      return { ...state, loggedInUser: action.payload };
    case CONSTANTS.SET_LOGGED_IN_USER_EMAIL:
      return { ...state, loggedInUserEmail: action.payload };
    case CONSTANTS.SET_LOGGED_IN_USER_ROLE:
      return { ...state, loggedInUserRole: action.payload };
    case CONSTANTS.SET_MENU_STATUS:
      return { ...state, menuStatus: action.payload };
    
    default:
      return state;
  }
};

export default rootReducer;
