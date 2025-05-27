import type { JSX} from 'react';
import React, { useEffect, useState } from 'react';
import { createUser } from '@services';
import { findUser } from '../../../pages/BoardPage/boardThunk';
import { useAppDispatch } from '../../../app/hooks';
import styles from './SignUpBox.module.scss';
import { getPasswordStrength, comparePasswords } from 'src/common/utils/validation';
import type { IUser } from '@interfaces';

export function SignUpBox({ setIsLogin }: { setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);
  // Responds for that if there is already a user with such data
  const [isAlreadyExist, setIsAlreadyExist] = useState(false);
  const [thirdErrorMessage, setThirdErrorMessage] = useState('Паролі не збігаються');

  const [passwordStrength, setPasswordStrength] = useState(''); // Class for color

  const dispatch = useAppDispatch();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    if (name === 'email') {
      setEmail(value);
      setIsEmailCorrect(emailRegex.test(value));
      setIsAlreadyExist(false);
    } else if (name === 'password') {
      setPassword(value);
      setPasswordStrength(getPasswordStrength(value));
    } else if (name === 'confirmedPassword') {
      setConfirmedPassword(value);
    }
  };

  const handleClick = async (): Promise<void> => {
    if (isEmailCorrect && email.length > 0 && isPasswordEqual && password.length > 0 && passwordStrength !== 'red') {
      try {
        const result: IUser[] | undefined = await dispatch(findUser({ emailOrUsername: email })).unwrap();

        if (result && result.length > 0 && result[0]?.id !== undefined && result[0].id > 0) {
          setThirdErrorMessage('Користувач з такою поштою вже існує');
          setIsAlreadyExist(true);
        } else {
          await createUser({ password, email });
          setIsAlreadyExist(false);
        }
      } catch (error) {
        console.error('Помилка запиту:', error);
      }
    }
  };

  const handleSwitchToLogin = (): void => {
    setIsLogin((prev: boolean) => !prev);
  };

  useEffect(() => {
    comparePasswords(password, confirmedPassword, setIsPasswordEqual, setThirdErrorMessage);
  }, [password, confirmedPassword]);

  return (
    <>
      <p className={styles.signup_subtitle}>Реєстрація</p>
      <div className={styles.signup_box}>
        <div className={styles.input_container}>
          <p>Електронна пошта</p>
          <input name="email" type="email" value={email} onChange={handleChange} />
        </div>
        <span className={!isEmailCorrect ? styles.error_message : styles.transparent}>
          Неправильний формат електронної пошти
        </span>

        <div className={styles.input_container}>
          <p>Пароль</p>
          <input name="password" type="password" value={password} onChange={handleChange} />
          <hr className={`${styles.password_bar} ${passwordStrength}`} />
        </div>
        <span className={passwordStrength === 'red' ? styles.error_message : styles.transparent}>Слабкий пароль</span>

        <div className={styles.input_container}>
          <p>Повторіть пароль</p>
          <input name="confirmedPassword" type="password" value={confirmedPassword} onChange={handleChange} />
        </div>
        <span className={!isPasswordEqual || isAlreadyExist ? styles.error_message : styles.transparent}>
          {thirdErrorMessage}
        </span>
      </div>
      <button onClick={handleClick} className={styles.signup_button}>
        Зареєструватися
      </button>
      <div className={styles.auth_toggle}>
        <p>Вже є акаунт ?</p>
        <span className={styles.signup_text} onClick={handleSwitchToLogin}>
          Увійти
        </span>
      </div>
    </>
  );
}
