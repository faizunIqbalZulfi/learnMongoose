const init = {
  id: "",
  name: "",
  age: ""
  // avatar: "",
  // updatedAt: ""
};

export default (state = init, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        age: action.payload.age
      };
    case "KEEP_LOGIN":
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        age: action.payload.age
      };
    case "EDIT_SUCCESS":
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        age: action.payload.age
      };
    case "LOGOUT":
      return {
        ...state,
        id: "",
        name: "",
        age: 0
      };

    default:
      return state;
  }
};
