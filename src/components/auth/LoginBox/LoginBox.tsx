import React, { JSX, useState } from 'react';
import { useNavigate } from 'react-router';
import { authorize } from '@services';
import { useAppSelector } from '../../../app/hooks';
import styles from './LoginBox.module.scss';

export function LoginBox({ setIsLogin }: { setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { pathname } = useAppSelector((state) => state.board);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    setIsError(false);
  };

  const handleClick = async (): Promise<void> => {
    if (emailRegex.test(email)) {
      setIsEmailCorrect(true);

      if (password.length > 6) {
        try {
          const authorizationData = await authorize({ password, email });
          if (authorizationData) {
            localStorage.setItem('token', authorizationData.token);
            localStorage.setItem('refreshToken', authorizationData.refreshToken);
            localStorage.setItem('authorizationStatus', authorizationData.result);
            // Navigate to the page which user tried to open or go to the home page
            navigate(pathname.length > 1 ? pathname : '/');
          } else {
            setIsError(true);
          }
        } catch (error) {
          console.error('Error during authorization:', error);
          setIsError(true);
        }
      }
    } else {
      setIsEmailCorrect(false);
    }
  };

  const handleSwitchToRegister = (): void => {
    setIsLogin((prev: boolean) => !prev);
  };

  return (
    <>
      <p className={styles.login_subtitle}>Вхід</p>
      <div className={styles.login_box}>
        <div className={styles.input_container}>
          <p>Електронна пошта</p>
          <input type="email" value={email} onChange={handleChange} name="email" />
        </div>
        <span className={`${styles.error_message} ${!isEmailCorrect ? '' : styles.transparent}`}>
          Неправильний формат електронної пошти
        </span>
        <div className={styles.input_container}>
          <p>Пароль</p>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        <span className={!isEmailCorrect || isError ? styles.error_message : styles.transparent}>
          Неправильна пошта та/або пароль
        </span>
        <button onClick={handleClick} className={styles.login_button}>
          Увійти
        </button>
        <div className={styles.auth_toggle}>
          <p>Ще не зареєстровані ?</p>
          <span className={styles.signup_text} onClick={handleSwitchToRegister}>
            Зареєструватися
          </span>
        </div>
      </div>
    </>
  );
}
