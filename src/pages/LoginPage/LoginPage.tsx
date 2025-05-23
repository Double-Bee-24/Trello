import React, { JSX, useState } from 'react';
import { LoginBox, SignUpBox } from '@components';
import styles from './LoginPage.module.scss';

export function LoginPage(): JSX.Element {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <div className={styles.login_page}>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        {isLogin ? <LoginBox setIsLogin={setIsLogin} /> : <SignUpBox setIsLogin={setIsLogin} />}
      </form>
    </div>
  );
}
