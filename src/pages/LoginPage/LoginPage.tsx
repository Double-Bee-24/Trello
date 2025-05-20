import React, { JSX, useState } from 'react';
import { LoginBox, SignUpBox } from '@components';
import styles from './LoginPage.module.scss';

export function LoginPage(): JSX.Element {
  const [isLogin, setIsLogin] = useState(true);

  const handleClick = (): void => {
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <div className={styles.login_page}>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <LoginBox />
            <div className={styles.auth_toggle}>
              <p>Ще не зареєстровані ?</p>
              <span className={styles.signup_text} onClick={handleClick}>
                Зареєструватися
              </span>
            </div>
          </>
        ) : (
          <>
            <SignUpBox />
            <div className={styles.auth_toggle}>
              <p>Вже є акаунт ?</p>
              <span className={styles.signup_text} onClick={handleClick}>
                Увійти
              </span>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
