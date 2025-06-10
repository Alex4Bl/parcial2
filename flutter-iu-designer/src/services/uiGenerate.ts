import api from "./api";

const uiGenerateService = {

  exportJsonFromImage: async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("ui", imageFile);

    const response = await api.post("/generate/generate-json", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "text",
    });

    return response.data;
  },
};

export default uiGenerateService;