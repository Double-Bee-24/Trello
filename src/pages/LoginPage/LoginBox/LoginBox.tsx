import React, { useState } from 'react';
import './loginBox.scss';
import { useNavigate } from 'react-router';
import { authorize } from '../../../api/request';
import { useAppSelector } from '../../../app/hooks';

export function LoginBox(): JSX.Element {
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

  return (
    <>
      <p className="login-subtitle">Вхід</p>
      <div className="login-box">
        <div className="input-container">
          <p>Електронна пошта</p>
          <input type="email" value={email} onChange={handleChange} name="email" />
        </div>
        <span className={`error-message ${!isEmailCorrect ? '' : 'transparent'}`}>
          Неправильний формат електронної пошти
        </span>
        <div className="input-container">
          <p>Пароль</p>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        <span className={!isEmailCorrect || isError ? 'error-message' : 'transparent'}>
          Неправильна пошта та/або пароль
        </span>
      </div>
      <button onClick={handleClick}>Увійти</button>
    </>
  );
}
