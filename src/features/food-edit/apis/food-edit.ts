import ApiBuilder from "@/shared/apis/builder/ApiBuilder";

const updateFoodApi = (fridgeId: number, foodId: number) =>
  ApiBuilder.create<FormData, void>(
    `/api/v1/refrigerators/${fridgeId}/foods/${foodId}`,
  )
    .setMethod("PATCH")
    .setHeaders({ "Content-Type": "multipart/form-data" });

export { updateFoodApi };
