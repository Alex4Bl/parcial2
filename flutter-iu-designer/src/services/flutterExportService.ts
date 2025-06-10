import api from "./api";

const flutterService = {
  exportFlutterProject: async (designJson: any): Promise<Blob> => {
    const response = await api.post("/flutter/generate-flutter", designJson, {
      responseType: "blob",
    });

    return response.data;
  },
};

export default flutterService;
