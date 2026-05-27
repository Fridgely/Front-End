import ApiBuilder from "@/shared/apis/builder/ApiBuilder";

const addFoodApi = (refrigeratorId: number) =>
  ApiBuilder.create<FormData, void>(
    `/api/v1/refrigerators/${refrigeratorId}/foods`,
  )
    .setMethod("POST")
    .setHeaders({ "Content-Type": "multipart/form-data" });

export { addFoodApi };
