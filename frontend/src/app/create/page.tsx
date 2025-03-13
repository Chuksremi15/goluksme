"use client";

import { Button } from "@heroui/react";
import { ImageUploader } from "../components/ImageUploader";
import { PageWrapper } from "../components/PageWrapper";
import * as yup from "yup";
import { ErrorIcon } from "react-hot-toast";
import { useFormik } from "formik";
import { createCampaignData } from "../services/campaign/create";
import { notification } from "../components/utils/Notification";
import { useAccount } from "wagmi";
import { useCreateCampaign } from "../campaign/hook/useCreateCampaign";
import { parseEther } from "viem";
import { useRouter } from "next/navigation";
import { FormError } from "../components/FormError";

const Page = () => {
  const { address, isConnected } = useAccount();

  const { createCampaign } = useCreateCampaign();

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      imgUrl: "",
      target: "",
    },
    validationSchema: yup.object().shape({
      title: yup
        .string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters"),

      description: yup
        .string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description cannot exceed 1000 characters"),
      imgUrl: yup
        .string()
        .required("Image URL is required")
        .url("Please enter a valid image URL"),
      target: yup
        .number()
        .required("Target amount is required")
        .positive("Target amount must be positive")
        .min(0.01, "Target amount must be at least 0.01"),
    }),

    onSubmit: async (prop) => {
      if (!isConnected) {
        notification.error({ message: "Connect wallet to proceed" });
        return;
      }
      const formData = {
        address: address,
        description: prop.description,
        imgurl: prop.imgUrl,
      };

      try {
        const response = await createCampaignData(formData);

        if (response) {
          const dataId = response.campaign._id;
          const target = prop.target.toString();
          const parsedTarget = parseEther(target);
          const title = prop.title;

          const trxHash = await createCampaign(title, dataId, parsedTarget);

          if (trxHash) {
            router.replace(`/campaign/${address}`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          notification.error({ message: error.message });
        } else {
        }
      }
    },
  });

  return (
    <PageWrapper>
      <div className="max-w-full rounded-xl overflow-hidden mt-4 px-4 py-2 text-black shadow">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full rounded-md border-gray-400 border focus:border-pink-500 focus:outline-none focus:shadow-outline p-3 sm:text-sm"
              placeholder="Enter campaign title"
            />
            {formik.touched.title && formik.errors.title && (
              <FormError message={formik.errors.title} />
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              cols={4}
              className="mt-1 block w-full max-w-3xl rounded-md border-gray-400 border focus:border-pink-500 focus:outline-none focus:shadow-outline p-3 sm:text-sm max-h-[170px]"
              placeholder="Describe your campaign"
            />
            {formik.touched.description && formik.errors.description && (
              <FormError message={formik.errors.description} />
            )}
          </div>

          <div>
            <label
              htmlFor="target"
              className="block text-sm font-medium text-gray-700"
            >
              Target Amount
            </label>
            <div className="mt-1 relative rounded-md border border-gray-400 focus-within:border-pink-500">
              <input
                type="number"
                id="target"
                name="target"
                value={formik.values.target}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-none pl-7 pr-12 focus:outline-none focus:shadow-outline p-3 sm:text-sm"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">LKS</span>
              </div>
            </div>
            {formik.touched.target && formik.errors.target && (
              <FormError message={formik.errors.target} />
            )}
          </div>
        </div>
        <ImageUploader setFieldValue={formik.setFieldValue} />
        {formik.errors.imgUrl && <FormError message={formik.errors.imgUrl} />}

        <Button
          type="submit"
          onPress={() => formik.handleSubmit()}
          size="lg"
          isLoading={formik.isSubmitting}
          className="w-full bg-pink-600 text-white font-semibold py-4 px-4 rounded-md  mt-6 mb-4"
        >
          Create Campaign
        </Button>
      </div>
    </PageWrapper>
  );
};

export default Page;
