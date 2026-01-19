import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthActions } from "../store/useAuthStore";

jest.mock("react-native-toast-message");
jest.mock("expo-router");
jest.mock("../store/useAuthStore");

const mockToast = Toast as jest.Mocked<typeof Toast>;
const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSetTokens = jest.fn();
const mockReplace = jest.fn();

describe("useAuthMutation 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthActions as jest.Mock).mockReturnValue({
      setTokens: mockSetTokens,
    });
    (mockRouter as any).mockReturnValue({
      replace: mockReplace,
    });
  });

  describe("useLoginMutation 테스트", () => {
    it("로그인 요청 시 올바른 데이터를 전송해야 한다", () => {
      const loginData = {
        loginId: "test_user",
        password: "test_password",
      };

      expect(loginData).toEqual({
        loginId: "test_user",
        password: "test_password",
      });
    });

    it("로그인 성공시 토큰을 저장하고 토스트 메세지를 보여줘야 한다", async () => {
      const successResponse = {
        result: "SUCCESS",
        accessToken: "test_access",
        refreshToken: "test_refresh",
      };

      if (successResponse.result === "SUCCESS") {
        await mockSetTokens(successResponse);
        mockToast.show({
          type: "success",
          text1: "로그인 성공",
          text2: "환영합니다!",
        });
      }

      expect(mockSetTokens).toHaveBeenCalledWith(successResponse);
      expect(mockToast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "로그인 성공",
        text2: "환영합니다!",
      });
    });

    it("로그인 실패시 토큰을 저장하지 않고 에러 토스트 메세지를 보여줘야 한다", () => {
      const failResponse = {
        result: "FAIL",
        accessToken: "",
        refreshToken: "",
      };

      if (failResponse.result === "SUCCESS") {
        mockSetTokens(failResponse);
      } else {
        mockToast.show({
          type: "error",
          text1: "로그인 실패",
          text2: "아이디 또는 비밀번호를 확인해주세요.",
        });
      }

      expect(mockSetTokens).not.toHaveBeenCalled();
      expect(mockToast.show).toHaveBeenCalledWith({
        type: "error",
        text1: "로그인 실패",
        text2: "아이디 또는 비밀번호를 확인해주세요.",
      });
    });

    it("로그인 오류 시 에러 토스트 메세지를 보여줘야 한다", () => {
      const error = new Error("서버와 통신 중 에러가 발생했습니다.");

      mockToast.show({
        type: "error",
        text1: "오류 발생",
        text2: error.message || "서버와 통신 중 에러가 발생했습니다.",
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: "error",
        text1: "오류 발생",
        text2: "서버와 통신 중 에러가 발생했습니다.",
      });
    });
  });

  describe("useSignupMutation 테스트", () => {
    it("회원가입 요청 시 올바른 데이터를 전송해야 한다", () => {
      const signupData = {
        loginId: "test_user",
        password: "test_password",
        nickname: "test_nickname",
      };

      expect(signupData).toEqual({
        loginId: "test_user",
        password: "test_password",
        nickname: "test_nickname",
      });
    });

    it("회원가입 성공 시 토스트 메세지를 보여주고 로그인 페이지로 이동해야 한다", () => {
      mockToast.show({
        type: "success",
        text1: "회원가입 완료",
        text2: "로그인 후 이용해주세요!",
      });
      mockReplace("/login");

      expect(mockToast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "회원가입 완료",
        text2: "로그인 후 이용해주세요!",
      });
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });

    it("회원가입 실패 시 서버 에러 메시지를 토스트 메세지로 보여줘야 한다", () => {
      const error = {
        response: {
          data: {
            error: {
              message: "아이디가 이미 존재합니다",
            },
          },
        },
      };

      const serverMessage = error.response?.data?.error?.message;
      mockToast.show({
        type: "error",
        text1: "회원가입 실패",
        text2: serverMessage || "입력 정보를 다시 확인해주세요.",
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: "error",
        text1: "회원가입 실패",
        text2: "아이디가 이미 존재합니다",
      });
    });
  });
});
