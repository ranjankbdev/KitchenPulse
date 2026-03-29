import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserAPI } from '../services/userService.js';
import { setUserData } from '../redux/userSlice.js';
import showToast from '../utils/toastHelper.js';

function useCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getUserAPI();
        dispatch(setUserData(data));
      } catch (error) {
        showToast(error, 'error');
      }
    };

    getUser();
  }, []);
}

export default useCurrentUser;
