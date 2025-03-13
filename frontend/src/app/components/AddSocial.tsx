import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react";

import { useAccount } from "wagmi";
import { useFormik } from "formik";
import { notification } from "./utils/Notification";
import { updateCampaignData } from "../services/campaign/update";
import * as yup from "yup";
import { FormError } from "./FormError";

export const AddSocial = ({ dataId }: { dataId: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { isConnected } = useAccount();

  const formik = useFormik({
    initialValues: {
      socialMediaLink: "",
    },
    validationSchema: yup.object().shape({
      socialMediaLink: yup
        .string()
        .required("Social media link is required")
        .min(3, "Social media link must be at least 3 characters")
        .max(255, "Social media link must be at most 255 characters")
        .url("Please enter a valid URL"),
    }),

    onSubmit: async (prop) => {
      if (!isConnected) {
        notification.error({ message: "Connect wallet to proceed" });
        return;
      }
      const formData = {
        socialMediaLink: prop.socialMediaLink,
      };

      try {
        const response = await updateCampaignData(formData, dataId);

        if (response) {
          notification.success({ message: "Social Link Added" });
        }
      } catch (error) {
        if (error instanceof Error) {
          notification.error({ message: error.message });
        } else {
          console.log("An unknown error occurred");
        }
      }
    },
  });

  return (
    <>
      <Button
        size="sm"
        onPress={onOpen}
        className=" bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
      >
        Add Social
      </Button>

      <Modal isOpen={isOpen} size={"sm"} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <div className="px-4 py-8 bg-base-200 text-black flex flex-col gap-y-4  ">
              <div>
                <h6 className="font-head text-base text-black text-center">
                  Add social media link to Campaign
                </h6>
                <div className="mt-5">
                  <input
                    type="text"
                    id="socialMediaLink"
                    name="socialMediaLink"
                    value={formik.values.socialMediaLink}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full  rounded-full border-gray-400 border  focus:border-pink-500 focus:outline-none focus:shadow-outline p-3 sm:text-sm "
                    placeholder="Enter link to social media post about campaign"
                  />
                  {formik.touched.socialMediaLink &&
                    formik.errors.socialMediaLink && (
                      <FormError message={formik.errors.socialMediaLink} />
                    )}
                  <Button
                    type="submit"
                    onPress={() => formik.handleSubmit()}
                    size="lg"
                    isLoading={formik.isSubmitting}
                    className="w-full bg-pink-500 text-white font-semibold py-4 px-4 rounded-full  mt-6 mb-4"
                  >
                    Add Link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
