interface GenerateInviteCodeResponse {
  result: string;
  data: {
    code: string;
    expirationAt: Date;
  };
}

export { GenerateInviteCodeResponse };
