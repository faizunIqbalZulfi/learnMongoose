import axios from "../config/axios";
import cookies from "universal-cookie";

const cookie = new cookies();

export const onRegister = (name, age, email, password) => {
  return dispatch => {
    axios
      .post("/users", {
        name,
        age,
        email,
        password
      })
      .then(res => {
        console.log("YEaaaayyy");
      })
      .catch(e => {
        console.log(e.response.data.replace("User validation failed: ", ""));
      });
  };
};

export const onLogin = (email, password) => {
  return async dispatch => {
    try {
      const res = await axios.post("/users/login", { email, password });
      console.log(res);

      cookie.set("masihLogin", res.data.name, { path: "/" });
      cookie.set("idLogin", res.data._id, { path: "/" });
      cookie.set("ageLogin", res.data.age, { path: "/" });
      cookie.set("emailLogin", res.data.email, { path: "/" });

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          id: res.data._id,
          name: res.data.name,
          age: res.data.age,
          email: res.data.email
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const onEdit = (name, age, email, password, userId) => {
  return async dispatch => {
    try {
      if (password === "") {
        var res = await axios.patch(`/users/${userId}`, {
          name,
          age,
          email
        });
      } else {
        var res = await axios.patch(`/users/${userId}`, {
          name,
          age,
          email,
          password
        });
      }
      cookie.set("masihLogin", res.data.name, { path: "/" });
      cookie.set("idLogin", res.data._id, { path: "/" });
      cookie.set("ageLogin", res.data.age, { path: "/" });
      cookie.set("emailLogin", res.data.email, { path: "/" });

      dispatch({
        type: "EDIT_SUCCESS",
        payload: {
          id: res.data._id,
          name: res.data.name,
          age: res.data.age,
          email: res.data.email
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
};

// export const onGetAvatar = userId => {
//   return async dispatch => {
//     try {
//       const res = await axios.get(`/users/${userId}`);
//       dispatch({
//         type: "AVATAR",
//         payload: {
//           avatar: `http://localhost:2009/users/${cookie.get("idLogin")}/avatar`,
//           updatedAt: new Date().getTime()
//         }
//       });
//     } catch (e) {}
//   };
// };

export const logout = () => {
  cookie.remove("masihLogin");
  cookie.remove("idLogin");
  cookie.remove("ageLogin");
  return {
    type: "LOGOUT"
  };
};

export const keepLogin = (name, id, age, email) => {
  if (name === undefined || id === undefined) {
    return {
      type: "KEEP_LOGIN",
      payload: {
        id: "",
        name: "",
        age: 0,
        email: ""
      }
    };
  }

  return {
    type: "KEEP_LOGIN",
    payload: {
      id,
      name,
      age,
      email
    }
  };
};
