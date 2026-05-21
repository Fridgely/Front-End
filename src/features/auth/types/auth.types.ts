import { Control } from "react-hook-form";

interface AuthFormData {
  id: string;
  password: string;
  nickname?: string;
  confirmPassword?: string;
}

interface AuthInputProps {
  label: string;
  name: keyof AuthFormData; // AuthFormData의 키값만 허용
  control: Control<any>;
  rules?: object;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  /**
   * 키보드 기본 default
   * email-address @와.버튼 포함
   * numeric 숫자
   */
  keyboardType?: "default" | "email-address" | "numeric";
}

export { AuthFormData, AuthInputProps };
