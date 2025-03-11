import express from "express";
import Campaign from "../model/campaign.js";
import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from "../statusCode.js";
import { generateToken, getAddressFromToken } from "../jsonWebToken.js";

const router = express.Router();

router.get("/token/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const token = generateToken(id);

    return res.status(SUCCESS).json({
      status: "success",
      token,
      message: "Token generated successfully",
    });
  } catch (err) {
    return res.status(SERVER_ERROR).json({
      status: "error",
      message: "Failed to generate token",
      error: err.message,
    });
  }
});

// Webhook endpoint to handle swap logs
router.post("/create", async (req, res) => {
  try {
    const { address, description, imgurl } = req.body;

    if (!address || !description || !imgurl) {
      return res.status(BAD_REQUEST).json({
        message: "Please provide all field values",
      });
    }

    const campaign = await Campaign.create({
      address,
      description,
      imgurl,
    });

    return res.status(SUCCESS).json({
      message: "Campaign created",
      campaign,
    });
  } catch (err) {
    return res.status(SERVER_ERROR).json({
      status: "error",
      message: "Failed to create campaign",
      error: err.message,
    });
  }
});

// Webhook endpoint to handle swap logs
router.put("/update/:campaignId", async (req, res) => {
  try {
    const address = getAddressFromToken(req);

    const { socialMediaLink } = req.body;
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId);

    if (campaign.address !== address) {
      return res.status(BAD_REQUEST).json({
        message: "You are not authorized to update this campaign",
      });
    }

    const response = await Campaign.findByIdAndUpdate(campaignId, {
      $set: {
        socialMediaLink,
      },
    });

    if (!response)
      return res.status(BAD_REQUEST).json({ message: "ITEM_NOT_FOUND" });

    return res
      .status(SUCCESS)
      .json({ message: "Campaign updated successfully" });
  } catch (err) {
    return res.status(SERVER_ERROR).json({
      status: "error",
      message: "Failed to update data",
      error: err.message,
    });
  }
});

// Endpoint to retrieve swap logs data
router.get("/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;

    const response = await Campaign.findById(campaignId);

    if (!response)
      return res.status(BAD_REQUEST).json({ message: "ITEM_NOT_FOUND" });

    return res.status(SUCCESS).json({
      status: "success",
      message: "Data retrieved successfully",
      campaign: response,
    });
  } catch (err) {
    return res.status(SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve data",
      error: err.message,
    });
  }
});

export default router;
