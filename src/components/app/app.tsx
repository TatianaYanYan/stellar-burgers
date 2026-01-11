import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  Ingredient
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  Modal,
  IngredientDetails,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/store/slices/user';
import { fetchIngredients } from '../../services/store/slices/ingredients';
import { getCookie } from '../../utils/cookie';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  const shouldShowModal =
    background && background.pathname !== location.pathname;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUser()).finally(() => {
        dispatch(setAuthChecked(true));
      });
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={shouldShowModal ? background : location}>
        <Route path={ROUTES.HOME} element={<ConstructorPage />} />
        <Route path={ROUTES.FEED} element={<Feed />} />
        <Route path={ROUTES.FEED_ORDER} element={<OrderInfo />} />
        <Route path={ROUTES.INGREDIENT} element={<Ingredient />} />
        <Route
          path={ROUTES.LOGIN}
          element={
            <ProtectedRoute isRouteUnauthorized>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <ProtectedRoute isRouteUnauthorized>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <ProtectedRoute isRouteUnauthorized>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <ProtectedRoute isRouteUnauthorized>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE_ORDERS}
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE_ORDER}
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound404 />} />
      </Routes>

      {shouldShowModal && (
        <Routes>
          <Route
            path={ROUTES.FEED_ORDER}
            element={
              <Modal onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={ROUTES.INGREDIENT}
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={ROUTES.PROFILE_ORDER}
            element={
              <ProtectedRoute>
                <Modal onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
