import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  user: {},
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    fetchUserSuccess(state, action) {
      state.user = action.payload;
    },
  },
});

export default slice.reducer;

const { setError, setLoading, fetchUserSuccess } = slice.actions;

// GET ME
export function GetMe() {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    // Check if the token is null or undefined
    if (!token) {
      console.warn("Token is null or undefined. Skipping API call.");
      dispatch(setError("No token available. Please log in."));
      toast.error("No token available. Please log in.");
      dispatch(setLoading(false)); // Ensure loading is set to false
      return; // Exit the function early
    }

    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      const response = await axios.get("/user/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchUserSuccess(response?.data?.data?.user));
    } catch (error) {
      console.log(error);
      dispatch(setError(error));
      toast.error(error?.message || "Something went wrong!");
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// UPDATE ME
export function UpdateMe(formValues) {
  return async (dispatch, getState) => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    await axios
      .patch(
        "/user/me",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        },
      )
      .then(function (response) {
        console.log(response);
        dispatch(fetchUserSuccess(response?.data?.data?.user));

        toast.success(response?.data?.message);
      })
      .catch(function (error) {
        console.log(error);
        dispatch(setError(error));
        toast.error(error?.message || "Something went wrong!");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

// UPDATE PASSWORD
export function UpdatePassword(formValues, handleLogout) {
  return async (dispatch, getState) => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    await axios
      .patch(
        "/user/password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        },
      )
      .then(function (response) {
        console.log(response);

        handleLogout();
        toast.success(response?.data?.message);
      })
      .catch(function (error) {
        console.log(error);
        dispatch(setError(error));
        toast.error(error?.message || "Something went wrong!");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

// UPDATE AVATAR

export function UpdateAvatar(formValues) {
  return async (dispatch, getState) => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    await axios
      .patch(
        "/user/avatar",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        },
      )
      .then(function (response) {
        console.log(response);
        dispatch(fetchUserSuccess(response?.data?.data?.user));

        toast.success(response?.data?.message);
      })
      .catch(function (error) {
        console.log(error);
        dispatch(setError(error));
        toast.error(error?.message || "Something went wrong!");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}
