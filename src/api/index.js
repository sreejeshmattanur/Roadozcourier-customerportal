export const createFranchiseApi = (formData) => 
  API.post("/franchise-applications/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });