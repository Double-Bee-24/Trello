import React, { useState } from 'react';
import './loginPage.scss';
import { LoginBox } from './LoginBox/LoginBox';
import { SignUpBox } from './SignUpBox/SignUpBox';

export function LoginPage(): JSX.Element {
  const [isLogin, setIsLogin] = useState(true);

  const handleClick = (): void => {
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <LoginBox />
            <div className="auth-toggle">
              <p>Ще не зареєстровані ?</p>
              <span className="signup-text" onClick={handleClick}>
                Зареєструватися
              </span>
            </div>
          </>
        ) : (
          <>
            <SignUpBox />
            <div className="auth-toggle">
              <p>Вже є акаунт ?</p>
              <span className="signup-text" onClick={handleClick}>
                Увійти
              </span>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
