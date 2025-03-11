import { ImageUploader } from "../components/ImageUploader";
import { PageWrapper } from "../components/PageWrapper";

const Create = () => {
  const uploadProgress = 50;
  return (
    <PageWrapper>
      <nav>
        <div className="ml-auto flex font-semibold justify-center items-center text-sm border p-2 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer ">
          Start a GoluksMe
        </div>
      </nav>

      <div className="max-w-full rounded-xl overflow-hidden   mt-4">
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
              className="mt-1 block w-full rounded-md border-gray-300 border  focus:border-pink focus:outline-none focus:shadow-outline p-3 sm:text-sm "
              placeholder="Enter campaign title"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Social Media Link
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full rounded-md border-gray-300 border  focus:border-pink focus:outline-none focus:shadow-outline p-3 sm:text-sm "
              placeholder="Enter link to social media post about campaign"
            />
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
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 border  focus:border-pink focus:outline-none focus:shadow-outline p-3 sm:text-sm "
              placeholder="Describe your campaign"
            />
          </div>

          <div>
            <label
              htmlFor="target"
              className="block text-sm font-medium text-gray-700"
            >
              Target Amount
            </label>
            <div className="mt-1 relative rounded-md border border-gray-200 focus-within:border-pink">
              <input
                type="number"
                id="target"
                name="target"
                className="block w-full rounded-md border-none pl-7 pr-12 focus:outline-none focus:shadow-outline p-3 sm:text-sm"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">ETH</span>
              </div>
            </div>
          </div>
        </div>
        <ImageUploader uploadProgress={uploadProgress} />

        <button
          type="submit"
          className="w-full bg-pink text-white font-semibold py-3 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink focus:ring-opacity-50 mt-6 mb-4 transition-all duration-300 cursor-pointer"
        >
          Create Campaign
        </button>
      </div>
    </PageWrapper>
  );
};

export default Create;
