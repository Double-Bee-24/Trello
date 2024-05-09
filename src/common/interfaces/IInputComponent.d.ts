export interface IInputComponent {
  setShouldInputBeOpen: (shouldInputBeOpen: boolean) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  isAddForm?: boolean;
}
