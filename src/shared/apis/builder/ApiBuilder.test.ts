import apiClient from "../apiClient";
import ApiBuilder from "./ApiBuilder";

// apiClient 모킹
jest.mock("../apiClient", () => jest.fn());

describe("ApiBuilder 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("빌더 메소드가 올바르게 값을 설정해야 한다", async () => {
    const builder = ApiBuilder.create("/test")
      .setMethod("POST")
      .setParams({ id: 1 })
      .setData({ name: "test" })
      .setHeaders({ Headers: "test" });

    (apiClient as unknown as jest.Mock).mockResolvedValue({ data: {} });
    await builder.execute();

    expect(apiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/test",
        params: { id: 1 },
        data: { name: "test" },
        headers: { Headers: "test" },
      })
    );
  });

  it("execute를 하면 apiClient가 올바른 인자와 함께 호출되어야 한다", async () => {
    const mockResponse = { data: { success: true } };
    (apiClient as unknown as jest.Mock).mockResolvedValue(mockResponse);

    const builder = ApiBuilder.create("/test")
      .setMethod("POST")
      .setData({ id: 1 });
    const result = await builder.execute();

    expect(apiClient).toHaveBeenCalledWith({
      method: "POST",
      url: "/test",
      data: { id: 1 },
    });
    expect(result).toEqual(mockResponse);
  });

  it("getQueryFn은 execute의 응답 데이터를 반환해야 한다", async () => {
    (apiClient as unknown as jest.Mock).mockResolvedValue({
      data: "result-data",
    });

    const queryFn = ApiBuilder.create("/test").getQueryFn();
    const data = await queryFn();

    expect(data).toBe("result-data");
  });
  it("getMutationFn은 호출 시 받은 데이터를 setData로 설정하고 execute해야 한다", async () => {
    const mockResponse = { data: { id: 1, name: "new item" } };
    (apiClient as unknown as jest.Mock).mockResolvedValue(mockResponse);

    const builder = ApiBuilder.create("/items").setMethod("POST");
    const mutationFn = builder.getMutationFn();

    const testData = { name: "new item" };
    const result = await mutationFn(testData);

    expect(apiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/items",
        data: testData,
      })
    );

    expect(result).toEqual(mockResponse.data);
  });
});
