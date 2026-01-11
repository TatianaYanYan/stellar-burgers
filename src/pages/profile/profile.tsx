import { ProfileUI } from '@ui-pages';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, updateUser } from '../../services/store/slices/user';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const initialValuesRef = useRef({
    name: '',
    email: ''
  });

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const newValues = {
        name: user.name || '',
        email: user.email || ''
      };

      // Обновляем форму и начальные значения только если они изменились
      if (
        initialValuesRef.current.name !== newValues.name ||
        initialValuesRef.current.email !== newValues.email
      ) {
        initialValuesRef.current = newValues;
        setFormValue({
          ...newValues,
          password: ''
        });
      }
    }
  }, [user]);

  const isFormChanged = useMemo(() => {
    if (!user) return false;

    return (
      formValue.name.trim() !== initialValuesRef.current.name.trim() ||
      formValue.email.trim() !== initialValuesRef.current.email.trim() ||
      formValue.password.trim().length > 0
    );
  }, [formValue, user]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user) return;

    const updateData: { name?: string; email?: string; password?: string } = {};

    const trimmedName = formValue.name.trim();
    const trimmedEmail = formValue.email.trim();

    if (trimmedName !== initialValuesRef.current.name.trim()) {
      updateData.name = trimmedName;
    }
    if (trimmedEmail !== initialValuesRef.current.email.trim()) {
      updateData.email = trimmedEmail;
    }
    if (formValue.password.trim()) {
      updateData.password = formValue.password.trim();
    }

    dispatch(updateUser(updateData))
      .unwrap()
      .then(() => {
        // Обновляем начальные значения после успешного сохранения
        initialValuesRef.current = {
          name: trimmedName,
          email: trimmedEmail
        };
        setFormValue({
          name: trimmedName,
          email: trimmedEmail,
          password: ''
        });
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      ...initialValuesRef.current,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
