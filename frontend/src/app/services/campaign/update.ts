import axios from "axios";

export const updateCampaignData = async (
  formData: any,
  dataId: string
): Promise<any> => {
  try {
    const response = await axios.post<any>("/api/campaign/update", {
      formData,
      dataId,
    });

    const { data } = response;

    if (!data) {
      throw new Error("Response data is missing");
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Request failed: ${error.response?.data?.message || error.message}`
      );
    } else {
      throw new Error(`Failed to create campaign: unknown error`);
    }
  }
};
