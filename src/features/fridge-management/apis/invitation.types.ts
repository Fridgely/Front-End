interface GenerateInviteCodeResponse {
  result: string;
  data: {
    code: string;
    expirationAt: Date;
  };
}

interface JoinFridgeByInviteCodeRequest {
  code: string;
}

interface JoinFridgeByInviteCodeResponse {
  result: string;
  data: string;
  error?: {
    code: string;
    message: string;
  };
}

export {
  GenerateInviteCodeResponse,
  JoinFridgeByInviteCodeRequest,
  JoinFridgeByInviteCodeResponse,
};
