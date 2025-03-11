import mongoose from "mongoose";

const CampaignSchema = mongoose.Schema({
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  socialMediaLink: {
    type: String,
  },
  imgurl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;
