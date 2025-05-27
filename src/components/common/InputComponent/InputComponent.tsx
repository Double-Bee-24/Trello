import type { JSX } from 'react';
import { useRef, useEffect } from 'react';
import type { IInputComponent } from '@interfaces';

export function InputComponent({
  setShouldInputBeOpen = (): void => {},
  handleChange,
  placeholder = '',
  className = '',
  value = '',
  isAddForm = false,
}: IInputComponent): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const closeInput = (): void => {
    const inputValue = inputRef.current?.value || '';
    if (inputValue.length === 0 || !isAddForm) {
      setShouldInputBeOpen(false);
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      ref={inputRef}
      onBlur={closeInput}
      className={className}
      value={value}
      name="title"
    />
  );
}
