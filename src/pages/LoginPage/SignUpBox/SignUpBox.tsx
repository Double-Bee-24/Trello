import React, { useEffect, useState } from 'react';
import { createUser } from '../../../api/request';
import './signUpBox.scss';
import { findUser } from '../../Board/boardSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { IUser } from '../../../common/interfaces/IUser';

// Function to determine password strength and set the appropriate class
const getPasswordStrength = (password: string): string => {
  if (password.length < 8 && password.length > 0) {
    return 'red'; // Very weak password
  }

  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Strong (letters, numbers, special characters)
  if (hasLetters && hasNumbers && hasSpecialChars && password.length >= 14) {
    return 'green'; // Strong password
  }
  // If the password contains only letters or only numbers, and it's long
  if ((hasLetters || hasNumbers || hasSpecialChars) && password.length >= 14) {
    return 'yellow'; // Moderate password
  }

  // Medium level (a)
  if (password.length >= 8) {
    return 'orange'; // Medium password
  }

  return '';
};

// Check if the passwords equal to provide correct authorization
function comparePasswords(
  password: string,
  confirmedPassword: string,
  setIsPasswordEqual: React.Dispatch<React.SetStateAction<boolean>>,
  setThirdErrorMessage: React.Dispatch<React.SetStateAction<string>>
): void {
  if (password === confirmedPassword) {
    setIsPasswordEqual(true);
  } else {
    setIsPasswordEqual(false);
    setThirdErrorMessage('Паролі не збігаються');
  }
}

export function SignUpBox(): JSX.Element {
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

  useEffect(() => {
    comparePasswords(password, confirmedPassword, setIsPasswordEqual, setThirdErrorMessage);
  }, [password, confirmedPassword]);

  return (
    <>
      <p className="signup-subtitle">Реєстрація</p>
      <div className="signup-box">
        <div className="input-container">
          <p>Електронна пошта</p>
          <input name="email" type="email" value={email} onChange={handleChange} />
        </div>
        <span className={!isEmailCorrect ? 'error-message' : 'transparent'}>Неправильний формат електронної пошти</span>

        <div className="input-container">
          <p>Пароль</p>
          <input name="password" type="password" value={password} onChange={handleChange} />
          <hr className={`password-bar ${passwordStrength}`} />
        </div>
        <span className={passwordStrength === 'red' ? 'error-message' : 'transparent'}>Слабкий пароль</span>

        <div className="input-container">
          <p>Повторіть пароль</p>
          <input name="confirmedPassword" type="password" value={confirmedPassword} onChange={handleChange} />
        </div>
        <span className={!isPasswordEqual || isAlreadyExist ? 'error-message' : 'transparent'}>
          {thirdErrorMessage}
        </span>
      </div>
      <button onClick={handleClick}>Зареєструватися</button>
    </>
  );
}
